import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs'
import { join, basename, relative } from 'path'
import prompts from 'prompts'
import pc from 'picocolors'
import { GHOSTLY, log, success, warn, error, step, getAppDir } from './utils.js'

interface ComponentImport {
  name: string
  path: string
  isList: boolean
}

function extractImports(filePath: string): ComponentImport[] {
  const content = readFileSync(filePath, 'utf-8')
  const imports: ComponentImport[] = []

  // Match: import { ComponentName } from '...'
  // or: import ComponentName from '...'
  const importRegex = /import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+['"]([^'"]+)['"]/g
  let match

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[3]
    // Skip node_modules, react, next imports
    if (!importPath.startsWith('.') && !importPath.startsWith('@/') && !importPath.startsWith('~/')) continue
    if (importPath.includes('react') || importPath.includes('next')) continue

    const names = match[1]
      ? match[1].split(',').map(n => n.trim().split(' as ')[0].trim()).filter(Boolean)
      : match[2] ? [match[2]] : []

    for (const name of names) {
      // Heuristic: PascalCase = component
      if (/^[A-Z]/.test(name)) {
        imports.push({ name, path: importPath, isList: false })
      }
    }
  }

  // Detect list patterns: .map( in JSX
  const mapPattern = /(\w+)(?:\.data)?(?:\?)?\.\w*map\s*\(\s*(?:\(?\w+\)?\s*=>\s*)?<(\w+)/g
  while ((match = mapPattern.exec(content)) !== null) {
    const component = match[2]
    const existing = imports.find(i => i.name === component)
    if (existing) existing.isList = true
  }

  return imports
}

function generateLoadingFile(components: ComponentImport[], routePath: string): string {
  const lines: string[] = []

  // Imports
  const ghostlyImports: string[] = ['Ghostly']
  const hasLists = components.some(c => c.isList)
  if (hasLists) ghostlyImports.push('GhostlyList')

  lines.push(`import { ${ghostlyImports.join(', ')} } from '@ghostly-ui/react'`)

  for (const comp of components) {
    lines.push(`import { ${comp.name} } from '${comp.path}'`)
  }

  lines.push('')
  lines.push('export default function Loading() {')
  lines.push('  return (')

  if (components.length === 1 && !components[0].isList) {
    // Single component
    lines.push('    <Ghostly loading={true}>')
    lines.push(`      <${components[0].name} />`)
    lines.push('    </Ghostly>')
  } else if (components.length === 1 && components[0].isList) {
    // Single list
    lines.push(`    <GhostlyList loading={true} count={6} item={<${components[0].name} />}>`)
    lines.push('      <></>')
    lines.push('    </GhostlyList>')
  } else {
    // Multiple components
    lines.push('    <div className="space-y-6">')
    for (const comp of components) {
      if (comp.isList) {
        lines.push(`      <GhostlyList loading={true} count={4} item={<${comp.name} />}>`)
        lines.push('        <></>')
        lines.push('      </GhostlyList>')
      } else {
        lines.push('      <Ghostly loading={true}>')
        lines.push(`        <${comp.name} />`)
        lines.push('      </Ghostly>')
      }
    }
    lines.push('    </div>')
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

  // If no path provided, scan for routes without loading.tsx
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
  const hasPage = entries.some(e => e.name.match(/^page\.(tsx|jsx|ts|js)$/))
  const hasLoading = entries.some(e => e.name.match(/^loading\.(tsx|jsx|ts|js)$/))

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

async function generateForRoute(routePath: string, appDir: string) {
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

  // Extract components from page
  const components = extractImports(pageFile)

  if (components.length === 0) {
    warn(`No components found in ${relative('.', pageFile)}`)

    const { manual } = await prompts({
      type: 'text',
      name: 'manual',
      message: 'Enter component name(s) to wrap (comma-separated):',
    })

    if (manual) {
      const names = manual.split(',').map((n: string) => n.trim()).filter(Boolean)
      for (const name of names) {
        components.push({ name, path: `@/components/${name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`, isList: false })
      }
    }
  }

  if (components.length === 0) return

  // Ask user to confirm/select components
  const { selected } = await prompts({
    type: 'multiselect',
    name: 'selected',
    message: `Components in ${relative('.', pageFile)}:`,
    choices: components.map(c => ({
      title: `${c.name}${c.isList ? pc.dim(' (list)') : ''}`,
      value: c.name,
      selected: true,
    })),
  })

  if (!selected || selected.length === 0) return

  const finalComponents = components.filter(c => selected.includes(c.name))
  const content = generateLoadingFile(finalComponents, routePath)

  if (!existsSync(routePath)) {
    mkdirSync(routePath, { recursive: true })
  }

  writeFileSync(loadingFile, content)
  success(`Created ${pc.bold(relative('.', loadingFile))}`)
  log(pc.dim(content))
}

function findPageFile(dir: string): string | null {
  for (const ext of ['tsx', 'jsx', 'ts', 'js']) {
    const f = join(dir, `page.${ext}`)
    if (existsSync(f)) return f
  }
  return null
}
