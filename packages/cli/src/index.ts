import pc from 'picocolors'

const GHOSTLY = pc.bold(pc.cyan('ghostly'))
const VERSION = '0.2.4'

const args = process.argv.slice(2)
const command = args[0]

async function main() {
  switch (command) {
    case 'init': {
      const { init } = await import('./init.js')
      await init()
      break
    }

    case 'add': {
      const subcommand = args[1]
      if (subcommand === 'loading') {
        const { addLoading } = await import('./add-loading.js')
        await addLoading(args[2])
      } else {
        console.log(`\n  ${GHOSTLY} Unknown: ${pc.red(`add ${subcommand || '?'}`)}\n`)
        console.log(`  Available:`)
        console.log(`    ${pc.cyan('ghostly add loading')} ${pc.dim('[path]')}  Generate loading.tsx files`)
        console.log()
      }
      break
    }

    case 'doctor': {
      const { doctor } = await import('./doctor.js')
      await doctor()
      break
    }

    case '--version':
    case '-v': {
      console.log(VERSION)
      break
    }

    case '--help':
    case '-h':
    case undefined: {
      console.log(`
  ${GHOSTLY} ${pc.dim(`v${VERSION}`)} — Zero-config skeleton loaders

  ${pc.bold('Commands:')}

    ${pc.cyan('ghostly init')}                 Set up Ghostly in your project
    ${pc.cyan('ghostly add loading')} ${pc.dim('[path]')}  Generate loading.tsx for Next.js routes
    ${pc.cyan('ghostly doctor')}               Check your Ghostly setup

  ${pc.bold('Examples:')}

    ${pc.dim('$')} npx @ghostly-ui/cli init
    ${pc.dim('$')} npx @ghostly-ui/cli add loading app/dashboard
    ${pc.dim('$')} npx @ghostly-ui/cli add loading ${pc.dim('(interactive — scans all routes)')}
    ${pc.dim('$')} npx @ghostly-ui/cli doctor

  ${pc.dim('Docs: https://ghostly.adanulissess.com')}
`)
      break
    }

    default: {
      console.log(`\n  ${GHOSTLY} Unknown command: ${pc.red(command)}`)
      console.log(`  Run ${pc.cyan('ghostly --help')} for available commands.\n`)
      process.exit(1)
    }
  }
}

main().catch((err) => {
  console.error(pc.red('Error:'), err.message)
  process.exit(1)
})
