import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs'
import { join, relative } from 'path'
import prompts from 'prompts'
import pc from 'picocolors'
import { GHOSTLY, log, success, warn, error, getAppDir } from './utils.js'

interface ComponentImport {
  name: string
  path: string
  isList: boolean
}

// Components/imports to NEVER include in loading.tsx
const SKIP_NAMES = new Set([
  'Link', 'redirect', 'notFound', 'Skeleton',
  'Metadata', 'Suspense', 'lazy', 'memo',
  'Button', 'Input', 'Select', 'Label', 'Checkbox',
  'Image', 'Script',
])

// Import paths to skip (utilities, hooks, constants, configs)
const SKIP_PATH_PATTERNS = [
  /\/hooks\//,
  /\/lib\//,
  /\/utils/,
  /\/config/,
  /\/routes/,
  /\/constants/,
  /\/actions\//,
  /\/services\//,
  /\/store\//,
  /\/types/,
  /\/seo/,
  /lucide/,
  /\/ui\//,
  /\/i18n\//,
  /next-intl/,
  /next\/image/,
  /next\/link/,
  /next\/navigation/,
]

function isSkippable(name: string, path: string): boolean {
  if (SKIP_NAMES.has(name)) return true
  // Skip UPPER_SNAKE_CASE constants
  if (/^[A-Z][A-Z_0-9]+$/.test(name)) return true
  // Skip names ending in Skeleton (already a skeleton)
  if (name.endsWith('Skeleton')) return true
  // Skip Stream components (used with Suspense)
  if (name.endsWith('Stream')) return true
  // Skip path patterns
  if (SKIP_PATH_PATTERNS.some(p => p.test(path))) return true
  return false
}

function extractMainComponent(filePath: string): ComponentImport | null {
  const content = readFileSync(filePath, 'utf-8')

  // Strategy 1: Find `return <ComponentName` in the default export function
  // This catches: return <PostersPage initialStats={stats} />
  const returnPattern = /return\s+<(\w+)/g
  const returnMatches: string[] = []
  let match
  while ((match = returnPattern.exec(content)) !== null) {
    const name = match[1]
    if (/^[A-Z]/.test(name) && !SKIP_NAMES.has(name) && name !== 'Ghostly') {
      returnMatches.push(name)
    }
  }

  // Find all imports
  const imports = extractImports(content)

  // If we found a clear return component, prefer it
  if (returnMatches.length === 1) {
    const imp = imports.find(i => i.name === returnMatches[0])
    if (imp) return imp
  }

  // Strategy 2: Filter to only "page-level" components
  const pageComponents = imports.filter(i => !isSkippable(i.name, i.path))

  if (pageComponents.length === 1) return pageComponents[0]
  if (pageComponents.length > 0) return null // ambiguous, ask user

  return null
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
        // Check for list pattern
        const isList = new RegExp(`\\.map\\s*\\([^)]*<${name}`).test(content)
        imports.push({ name, path: importPath, isList })
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

  const nonListComponents = components.filter(c => !c.isList)
  const listComponents = components.filter(c => c.isList)

  if (components.length === 1 && !components[0].isList) {
    lines.push('    <Ghostly loading={true}>')
    lines.push(`      <${components[0].name} />`)
    lines.push('    </Ghostly>')
  } else if (components.length === 1 && components[0].isList) {
    lines.push(`    <GhostlyList loading={true} count={6} item={<${components[0].name} />}>`)
    lines.push('      <></>')
    lines.push('    </GhostlyList>')
  } else {
    // Wrap ALL non-list components in a single Ghostly
    lines.push('    <Ghostly loading={true}>')
    lines.push('      <div className="space-y-6">')
    for (const comp of nonListComponents) {
      lines.push(`        <${comp.name} />`)
    }
    for (const comp of listComponents) {
      lines.push(`        {/* List: ${comp.name} */}`)
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
      await generateForRoute(route, appDir)
    }
  } else {
    const fullPath = routePath.startsWith(appDir) ? routePath : join(appDir, routePath)
    await generateForRoute(fullPath, appDir)
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

async function generateForRoute(routePath: string, _appDir: string) {
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

  // Try to find the main component automatically
  const mainComp = extractMainComponent(pageFile)
  const content = readFileSync(pageFile, 'utf-8')
  const allComponents = extractImports(content)

  let finalComponents: ComponentImport[]

  if (mainComp) {
    // Found a clear main component
    finalComponents = [mainComp]
    log(`${pc.dim('Auto-detected:')} ${pc.cyan(mainComp.name)} in ${relative('.', pageFile)}`)
  } else if (allComponents.length > 0) {
    // Ask user to select
    const { selected } = await prompts({
      type: 'multiselect',
      name: 'selected',
      message: `Components in ${relative('.', pageFile)}:`,
      choices: allComponents.map(c => ({
        title: `${c.name}${c.isList ? pc.dim(' (list)') : ''}`,
        value: c.name,
        selected: true,
      })),
    })

    if (!selected || selected.length === 0) return
    finalComponents = allComponents.filter(c => selected.includes(c.name))
  } else {
    // No components found — ask for manual input
    warn(`No components found in ${relative('.', pageFile)}`)
    const { manual } = await prompts({
      type: 'text',
      name: 'manual',
      message: 'Enter component name to wrap:',
    })

    if (!manual) return
    finalComponents = [{
      name: manual.trim(),
      path: `@/components/${manual.trim().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`,
      isList: false,
    }]
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
