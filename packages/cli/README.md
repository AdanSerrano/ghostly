# @ghostly-ui/cli

CLI for [Ghostly](https://github.com/AdanSerrano/ghostly) — set up your project, generate loading states, diagnose issues.

## Commands

### `ghostly init`

Interactive setup wizard. Installs packages, adds CSS import, configures GhostlyProvider and Tailwind plugin.

```bash
npx @ghostly-ui/cli init
```

### `ghostly add loading [path]`

Generates `loading.tsx` files for Next.js App Router routes. Scans your `page.tsx` files, detects components, and creates skeleton loading states automatically.

```bash
# Interactive — scans all routes, lets you pick
npx @ghostly-ui/cli add loading

# Specific route
npx @ghostly-ui/cli add loading app/dashboard
```

### `ghostly doctor`

Health check for your Ghostly setup. Verifies packages, CSS import, provider, React version, loading.tsx coverage, and more.

```bash
npx @ghostly-ui/cli doctor
```

## Documentation

Full docs at [ghostly.adanulissess.com](https://ghostly.adanulissess.com)

## License

MIT
