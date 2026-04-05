import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'fs'
import { execSync } from 'child_process'
import prompts from 'prompts'
import pc from 'picocolors'
import {
  GHOSTLY, log, success, warn, error, step,
  detectPackageManager, installCmd, fileContains, findFile, readJson, isNextJs,
} from './utils.js'

export async function init() {
  console.log(`\n  ${GHOSTLY} ${pc.dim('— Setup wizard')}\n`)

  // Detect environment
  const pm = detectPackageManager()
  const nextjs = isNextJs()
  const pkg = readJson('package.json')

  if (!pkg) {
    error('No package.json found. Run this from your project root.')
    process.exit(1)
  }

  log(`Package manager: ${pc.bold(pm)}`)
  log(`Framework: ${pc.bold(nextjs ? 'Next.js' : 'React')}`)

  // Check if already installed
  const deps = { ...(pkg.dependencies as Record<string, string> || {}), ...(pkg.devDependencies as Record<string, string> || {}) }
  const hasCore = '@ghostly-ui/core' in deps
  const hasReact = '@ghostly-ui/react' in deps

  if (hasCore && hasReact) {
    success('Ghostly packages already installed')
  }

  // Ask what to set up
  const { features } = await prompts({
    type: 'multiselect',
    name: 'features',
    message: 'What should we set up?',
    choices: [
      { title: 'Install packages', value: 'install', selected: !hasCore || !hasReact },
      { title: 'Import CSS in globals.css', value: 'css', selected: true },
      { title: 'Add GhostlyProvider to layout', value: 'provider', selected: true },
      { title: 'Add Tailwind plugin', value: 'tailwind', selected: 'tailwindcss' in deps },
    ],
  })

  if (!features || features.length === 0) {
    log(pc.dim('Nothing selected. Exiting.'))
    return
  }

  let stepN = 0

  // 1. Install packages
  if (features.includes('install')) {
    stepN++
    step(stepN, 'Installing packages...')
    const cmd = installCmd(pm, '@ghostly-ui/core', '@ghostly-ui/react')
    log(pc.dim(`$ ${cmd}`))
    try {
      execSync(cmd, { stdio: 'inherit' })
      success('Packages installed')
    } catch {
      error('Failed to install packages. Try manually:')
      log(pc.dim(cmd))
    }
  }

  // 2. Import CSS
  if (features.includes('css')) {
    stepN++
    step(stepN, 'Adding CSS import...')

    const cssFile = findFile(
      'src/app/globals.css',
      'app/globals.css',
      'src/styles/globals.css',
      'styles/globals.css',
      'src/index.css',
      'index.css',
    )

    if (!cssFile) {
      warn('Could not find globals.css. Add this manually:')
      log(pc.dim("  @import '@ghostly-ui/core/css';"))
    } else if (fileContains(cssFile, '@ghostly-ui/core/css')) {
      success(`CSS already imported in ${cssFile}`)
    } else {
      const content = readFileSync(cssFile, 'utf-8')
      // Add after the last @import or at the top
      const lastImport = content.lastIndexOf('@import')
      if (lastImport >= 0) {
        const lineEnd = content.indexOf('\n', lastImport)
        const before = content.substring(0, lineEnd + 1)
        const after = content.substring(lineEnd + 1)
        writeFileSync(cssFile, `${before}@import '@ghostly-ui/core/css';\n${after}`)
      } else {
        writeFileSync(cssFile, `@import '@ghostly-ui/core/css';\n${content}`)
      }
      success(`Added CSS import to ${pc.bold(cssFile)}`)
    }
  }

  // 3. Add GhostlyProvider
  if (features.includes('provider')) {
    stepN++
    step(stepN, 'Adding GhostlyProvider...')

    const layoutFile = findFile(
      'src/app/layout.tsx',
      'app/layout.tsx',
      'src/app/layout.jsx',
      'app/layout.jsx',
    )

    if (!layoutFile) {
      warn('Could not find layout.tsx. Add GhostlyProvider manually:')
      log(pc.dim("  import { GhostlyProvider } from '@ghostly-ui/react'"))
      log(pc.dim('  <GhostlyProvider>{children}</GhostlyProvider>'))
    } else if (fileContains(layoutFile, 'GhostlyProvider')) {
      success(`GhostlyProvider already in ${layoutFile}`)
    } else {
      const content = readFileSync(layoutFile, 'utf-8')
      // Add import at top
      const importLine = "import { GhostlyProvider } from '@ghostly-ui/react'\n"
      // Wrap {children} with <GhostlyProvider>
      const wrapped = content
        .replace(
          /^/,
          importLine,
        )
        .replace(
          /\{children\}/,
          '<GhostlyProvider>{children}</GhostlyProvider>',
        )
      writeFileSync(layoutFile, wrapped)
      success(`Added GhostlyProvider to ${pc.bold(layoutFile)}`)
    }
  }

  // 4. Tailwind plugin
  if (features.includes('tailwind')) {
    stepN++
    step(stepN, 'Adding Tailwind plugin...')

    const twConfig = findFile(
      'tailwind.config.ts',
      'tailwind.config.js',
      'tailwind.config.mjs',
    )

    if (!twConfig) {
      warn('Could not find tailwind.config. Add manually:')
      log(pc.dim("  import ghostly from '@ghostly-ui/core/tailwind'"))
      log(pc.dim('  plugins: [ghostly]'))
    } else if (fileContains(twConfig, '@ghostly-ui/core/tailwind')) {
      success(`Tailwind plugin already in ${twConfig}`)
    } else {
      warn(`Add to ${pc.bold(twConfig)} manually:`)
      log(pc.dim("  import ghostly from '@ghostly-ui/core/tailwind'"))
      log(pc.dim('  plugins: [ghostly]'))
      log(pc.dim('  (Auto-editing Tailwind configs is risky — too many formats)'))
    }
  }

  // Done
  console.log(`\n  ${pc.green('Done!')} Ghostly is ready.\n`)
  log(`Next steps:`)
  log(`  ${pc.dim('1.')} Wrap a component: ${pc.cyan('<Ghostly loading={isLoading}><Card /></Ghostly>')}`)
  log(`  ${pc.dim('2.')} Generate loading.tsx: ${pc.cyan('npx @ghostly-ui/cli add loading app/dashboard')}`)
  log(`  ${pc.dim('3.')} Read the docs: ${pc.cyan('https://ghostly.adanulissess.com/docs')}`)
  console.log()
}
