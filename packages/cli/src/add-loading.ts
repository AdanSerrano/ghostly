import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from 'fs'
import { join, relative } from 'path'
import prompts from 'prompts'
import pc from 'picocolors'
import { GHOSTLY, log, success, warn, error, getAppDir } from './utils.js'

interface ComponentImport {
  name: string
  path: string
  isList: boolean
  hasRequiredProps: boolean
}

// Components/imports to NEVER include in loading.tsx
const SKIP_NAMES = new Set([
  'Link', 'redirect', 'notFound', 'Skeleton',
  'Metadata', 'Suspense', 'lazy', 'memo',
  'Button', 'Input', 'Select', 'Label', 'Checkbox',
  'Image', 'Script',
])

// Import paths to skip
const SKIP_PATH_PATTERNS = [
  /\/hooks\//,  /\/lib\//,  /\/utils/,  /\/config/,
  /\/routes/,   /\/constants/,  /\/actions\//,
  /\/services\//, /\/store\//, /\/types/,  /\/seo/,
  /lucide/,  /\/ui\//,  /\/i18n\//,
  /next-intl/,  /next\/image/,  /next\/link/,  /next\/navigation/,
]

function isSkippable(name: string, path: string): boolean {
  if (SKIP_NAMES.has(name)) return true
  if (/^[A-Z][A-Z_0-9]+$/.test(name)) return true
  if (name.endsWith('Skeleton')) return true
  if (name.endsWith('Stream')) return true
  if (name.endsWith('JsonLd')) return true
  if (name.endsWith('Scripts')) return true
  if (name === 'BackToTop') return true
  if (name === 'ScrollToTop') return true
  if (name === 'CookieConsent') return true
  if (SKIP_PATH_PATTERNS.some(p => p.test(path))) return true
  return false
}

/**
 * Check if a component is rendered WITH props in the page content.
 * If `<Component prop={x} />` has props, it needs data → can't be empty in loading.
 */
function hasPropsInUsage(componentName: string, pageContent: string): boolean {
  // Match <ComponentName followed by a prop (word=)
  const usagePattern = new RegExp(
    `<${componentName}\\s+[a-zA-Z]`,
  )
  return usagePattern.test(pageContent)
}

/**
 * Try to resolve the component source file and check for required props.
 */
function checkComponentRequiresProps(componentName: string, importPath: string): boolean {
  // Resolve the file path
  const base = importPath.replace(/^@\//, '')
  const candidates = [
    base + '.tsx',
    base + '.ts',
    base + '/index.tsx',
    base + '/index.ts',
  ]

  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue
    // Skip directories
    try { if (statSync(candidate).isDirectory()) continue } catch { continue }
    const content = readFileSync(candidate, 'utf-8')

    // Check if the component accepts required props
    // Look for interface/type with non-optional properties
    const interfaceMatch = content.match(
      new RegExp(`interface\\s+${componentName}Props\\s*\\{([^}]+)\\}`)
    )
    if (interfaceMatch) {
      const body = interfaceMatch[1]
      // Check for required props (no ? before :)
      const props = body.split('\n').filter(line => {
        const trimmed = line.trim()
        return trimmed.length > 0
          && !trimmed.startsWith('//')
          && !trimmed.startsWith('*')
          && trimmed.includes(':')
          && !trimmed.includes('?:') // optional
          && !trimmed.startsWith('children') // children is ok empty
      })
      if (props.length > 0) return true
    }

    // Also check for destructured props with defaults
    const funcMatch = content.match(
      new RegExp(`function\\s+${componentName}\\s*\\(\\s*\\{([^}]+)\\}`)
    )
    if (funcMatch) {
      const params = funcMatch[1]
      // If any param doesn't have a default value and isn't children
      const required = params.split(',').filter(p => {
        const trimmed = p.trim()
        return trimmed.length > 0
          && !trimmed.includes('=') // has default
          && !trimmed.startsWith('children')
          && !trimmed.startsWith('...')
      })
      if (required.length > 0) return true
    }
  }

  return false
}

function extractImports(content: string): ComponentImport[] {
  const imports: ComponentImport[] = []
  const importRegex = /import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"]([^'"]+)['"]/g
  let match

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[3]
    if (!importPath.startsWith('.') && !importPath.startsWith('@/') && !importPath.startsWith('~/')) continue
    if (importPath.includes('react') || importPath === 'next') continue

    const names = match[1]
      ? match[1].split(',').map(n => n.trim().split(' as ')[0].trim()).filter(Boolean)
      : match[2] ? [match[2]] : []

    for (const name of names) {
      if (/^[A-Z]/.test(name) && !isSkippable(name, importPath)) {
        const isList = new RegExp(`\\.map\\s*\\([^)]*<${name}`).test(content)
        const hasRequiredProps = hasPropsInUsage(name, content) || checkComponentRequiresProps(name, importPath)
        imports.push({ name, path: importPath, isList, hasRequiredProps })
      }
    }
  }

  return imports
}

function generateLoadingFile(components: ComponentImport[]): string {
  const lines: string[] = []

  const hasLists = components.some(c => c.isList)
  const ghostlyImports = hasLists ? ['Ghostly', 'GhostlyList'] : ['Ghostly']

  lines.push(`import { ${ghostlyImports.join(', ')} } from '@ghostly-ui/react'`)

  for (const comp of components) {
    lines.push(`import { ${comp.name} } from '${comp.path}'`)
  }

  lines.push('')
  lines.push('export default function Loading() {')
  lines.push('  return (')

  if (components.length === 1 && !components[0].isList) {
    lines.push('    <Ghostly loading={true}>')
    lines.push(`      <${components[0].name} />`)
    lines.push('    </Ghostly>')
  } else if (components.length === 1 && components[0].isList) {
    lines.push(`    <GhostlyList loading={true} count={6} item={<${components[0].name} />}>`)
    lines.push('      <></>')
    lines.push('    </GhostlyList>')
  } else {
    lines.push('    <Ghostly loading={true}>')
    lines.push('      <div className="space-y-6">')
    for (const comp of components) {
      lines.push(`        <${comp.name} />`)
    }
    lines.push('      </div>')
    lines.push('    </Ghostly>')
  }

  lines.push('  )')
  lines.push('}')
  lines.push('')

  return lines.join('\n')
}

export async function addLoading(routePath?: string) {
  console.log(`\n  ${GHOSTLY} ${pc.dim('— Generate loading.tsx')}\n`)

  const appDir = getAppDir()
  if (!appDir) {
    error('No app/ directory found. This command requires Next.js App Router.')
    process.exit(1)
  }

  if (!routePath) {
    const routes = scanRoutes(appDir)
    const missing = routes.filter(r => !r.hasLoading)

    if (missing.length === 0) {
      success('All routes already have loading.tsx files!')
      return
    }

    log(`Found ${pc.bold(String(missing.length))} route(s) without loading.tsx:\n`)
    missing.forEach(r => log(`  ${pc.dim('•')} ${r.path}`))
    console.log()

    const { selected } = await prompts({
      type: 'multiselect',
      name: 'selected',
      message: 'Select routes to generate loading.tsx for:',
      choices: missing.map(r => ({
        title: r.path,
        value: r.path,
        selected: true,
      })),
    })

    if (!selected || selected.length === 0) return

    for (const route of selected) {
      await generateForRoute(route)
    }
  } else {
    const fullPath = routePath.startsWith(appDir) ? routePath : join(appDir, routePath)
    await generateForRoute(fullPath)
  }

  console.log()
}

interface RouteInfo {
  path: string
  hasLoading: boolean
  hasPage: boolean
}

function scanRoutes(dir: string, routes: RouteInfo[] = []): RouteInfo[] {
  if (!existsSync(dir)) return routes

  const entries = readdirSync(dir, { withFileTypes: true })
  const hasPage = entries.some(e => /^page\.(tsx|jsx|ts|js)$/.test(e.name))
  const hasLoading = entries.some(e => /^loading\.(tsx|jsx|ts|js)$/.test(e.name))

  if (hasPage) {
    routes.push({ path: dir, hasLoading, hasPage })
  }

  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.')) {
      scanRoutes(join(dir, entry.name), routes)
    }
  }

  return routes
}

async function generateForRoute(routePath: string) {
  const pageFile = findPageFile(routePath)
  if (!pageFile) {
    warn(`No page.tsx found in ${routePath}`)
    return
  }

  const loadingFile = join(routePath, 'loading.tsx')
  if (existsSync(loadingFile)) {
    warn(`${relative('.', loadingFile)} already exists — skipping`)
    return
  }

  const content = readFileSync(pageFile, 'utf-8')
  const allComponents = extractImports(content)

  // Split into safe (no required props) and unsafe (has required props)
  const safeComponents = allComponents.filter(c => !c.hasRequiredProps)
  const unsafeComponents = allComponents.filter(c => c.hasRequiredProps)

  if (unsafeComponents.length > 0) {
    warn(`Skipping components with required props in ${relative('.', pageFile)}:`)
    unsafeComponents.forEach(c => log(`  ${pc.dim('×')} ${c.name} ${pc.dim('(needs props)')}`))
  }

  if (safeComponents.length === 0) {
    warn(`No zero-prop components found in ${relative('.', pageFile)} — skipping`)
    log(pc.dim('  Tip: components with required props need manual loading.tsx'))
    return
  }

  let finalComponents: ComponentImport[]

  if (safeComponents.length === 1) {
    finalComponents = safeComponents
    log(`${pc.dim('Auto-detected:')} ${pc.cyan(safeComponents[0].name)}`)
  } else {
    const { selected } = await prompts({
      type: 'multiselect',
      name: 'selected',
      message: `Safe components in ${relative('.', pageFile)}:`,
      choices: safeComponents.map(c => ({
        title: `${c.name}${c.isList ? pc.dim(' (list)') : ''}`,
        value: c.name,
        selected: true,
      })),
    })

    if (!selected || selected.length === 0) return
    finalComponents = safeComponents.filter(c => selected.includes(c.name))
  }

  if (finalComponents.length === 0) return

  const fileContent = generateLoadingFile(finalComponents)

  if (!existsSync(routePath)) {
    mkdirSync(routePath, { recursive: true })
  }

  writeFileSync(loadingFile, fileContent)
  success(`Created ${pc.bold(relative('.', loadingFile))}`)
  log(pc.dim(fileContent))
}

function findPageFile(dir: string): string | null {
  for (const ext of ['tsx', 'jsx', 'ts', 'js']) {
    const f = join(dir, `page.${ext}`)
    if (existsSync(f)) return f
  }
  return null
}
