import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import pc from 'picocolors'
import { GHOSTLY, success, warn, error, fileContains, findFile, readJson, isNextJs, getAppDir } from './utils.js'

interface Check {
  name: string
  ok: boolean
  message: string
}

export async function doctor() {
  console.log(`\n  ${GHOSTLY} ${pc.dim('— Health check')}\n`)

  const checks: Check[] = []

  // 1. package.json exists
  const pkg = readJson('package.json')
  checks.push({
    name: 'package.json',
    ok: !!pkg,
    message: pkg ? 'Found' : 'No package.json — run from project root',
  })

  if (!pkg) {
    printResults(checks)
    return
  }

  const deps = {
    ...(pkg.dependencies as Record<string, string> || {}),
    ...(pkg.devDependencies as Record<string, string> || {}),
  }

  // 2. Core package installed
  const hasCore = '@ghostly-ui/core' in deps
  checks.push({
    name: '@ghostly-ui/core',
    ok: hasCore,
    message: hasCore
      ? `Installed (${deps['@ghostly-ui/core']})`
      : 'Not installed — run: npx @ghostly-ui/cli init',
  })

  // 3. React package installed
  const hasReact = '@ghostly-ui/react' in deps
  checks.push({
    name: '@ghostly-ui/react',
    ok: hasReact,
    message: hasReact
      ? `Installed (${deps['@ghostly-ui/react']})`
      : 'Not installed — run: npx @ghostly-ui/cli init',
  })

  // 4. CSS imported
  const cssFile = findFile(
    'src/app/globals.css', 'app/globals.css',
    'src/styles/globals.css', 'styles/globals.css',
    'src/index.css', 'index.css',
  )
  const cssImported = cssFile ? fileContains(cssFile, '@ghostly-ui/core/css') : false
  checks.push({
    name: 'CSS import',
    ok: cssImported,
    message: cssImported
      ? `Found in ${cssFile}`
      : cssFile
        ? `Missing in ${cssFile} — add: @import '@ghostly-ui/core/css'`
        : 'No globals.css found',
  })

  // 5. React version
  const reactVersion = deps['react'] || ''
  const reactOk = reactVersion && parseInt(reactVersion.replace(/[^0-9]/g, '')) >= 18
  checks.push({
    name: 'React version',
    ok: !!reactOk,
    message: reactVersion ? `${reactVersion} ${reactOk ? '' : '(needs >=18)'}` : 'Not found',
  })

  // 6. Next.js detection
  const nextjs = isNextJs()
  if (nextjs) {
    checks.push({ name: 'Framework', ok: true, message: 'Next.js detected' })

    // 7. App Router
    const appDir = getAppDir()
    checks.push({
      name: 'App Router',
      ok: !!appDir,
      message: appDir ? `Found at ${appDir}/` : 'Not found (Pages Router?)',
    })

    // 8. GhostlyProvider in layout
    const layoutFile = findFile('src/app/layout.tsx', 'app/layout.tsx')
    const hasProvider = layoutFile ? fileContains(layoutFile, 'GhostlyProvider') : false
    checks.push({
      name: 'GhostlyProvider',
      ok: hasProvider,
      message: hasProvider
        ? `Found in ${layoutFile}`
        : 'Optional — add to layout.tsx for global defaults',
    })

    // 9. loading.tsx files
    if (appDir) {
      const { total, withLoading } = countRoutes(appDir)
      checks.push({
        name: 'loading.tsx coverage',
        ok: withLoading === total,
        message: `${withLoading}/${total} routes have loading.tsx${
          withLoading < total ? ` — run: npx @ghostly-ui/cli add loading` : ''
        }`,
      })
    }
  }

  // 10. Tailwind plugin
  const hasTailwind = 'tailwindcss' in deps
  if (hasTailwind) {
    const twConfig = findFile('tailwind.config.ts', 'tailwind.config.js', 'tailwind.config.mjs')
    const hasPlugin = twConfig ? fileContains(twConfig, '@ghostly-ui/core/tailwind') : false
    checks.push({
      name: 'Tailwind plugin',
      ok: hasPlugin,
      message: hasPlugin
        ? `Found in ${twConfig}`
        : 'Optional — add for ghostly-* utility classes',
    })
  }

  // 11. node_modules check
  const coreExists = existsSync('node_modules/@ghostly-ui/core/dist/ghostly.css')
  checks.push({
    name: 'Built CSS',
    ok: coreExists,
    message: coreExists ? 'ghostly.css found in node_modules' : 'CSS file missing — try reinstalling',
  })

  printResults(checks)
}

function printResults(checks: Check[]) {
  const passed = checks.filter(c => c.ok).length
  const total = checks.length

  for (const check of checks) {
    if (check.ok) {
      success(`${check.name}: ${pc.dim(check.message)}`)
    } else {
      const fn = check.message.includes('Optional') ? warn : error
      fn(`${check.name}: ${check.message}`)
    }
  }

  console.log()
  if (passed === total) {
    console.log(`  ${pc.green(pc.bold(`All ${total} checks passed!`))} Ghostly is healthy.\n`)
  } else {
    console.log(`  ${pc.yellow(`${passed}/${total} checks passed.`)} Fix the issues above.\n`)
  }
}

function countRoutes(dir: string): { total: number; withLoading: number } {
  let total = 0
  let withLoading = 0

  function scan(d: string) {
    if (!existsSync(d)) return
    const entries = readdirSync(d, { withFileTypes: true })
    const hasPage = entries.some((e) => /^page\.(tsx|jsx|ts|js)$/.test(e.name))
    const hasLoadingFile = entries.some((e) => /^loading\.(tsx|jsx|ts|js)$/.test(e.name))

    if (hasPage) {
      total++
      if (hasLoadingFile) withLoading++
    }

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('_') && !entry.name.startsWith('.')) {
        scan(join(d, entry.name))
      }
    }
  }

  scan(dir)
  return { total, withLoading }
}
