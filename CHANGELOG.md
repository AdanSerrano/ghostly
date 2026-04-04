# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-04

### Added

- `ghostly` core package with CSS-first skeleton engine
  - 3 animations: shimmer, pulse, wave
  - Automatic dark mode detection (`.dark`, `data-theme`, `prefers-color-scheme`)
  - CSS custom properties for customization (`--ghostly-color`, `--ghostly-shine`, `--ghostly-radius`, `--ghostly-speed`)
  - `prefers-reduced-motion: reduce` support
  - `data-ghostly-ignore` attribute for exclusions
  - Semantic min-height defaults for headings, paragraphs, buttons, inputs
- `@ghostly/react` package with React components
  - `<Ghostly>` — main wrapper component
  - `<GhostlyList>` — skeleton loader for lists and grids
  - `<GhostlyProvider>` — global configuration provider
  - `useGhostly()` hook for reading context
- Playground app (Next.js) with interactive demo
- Documentation: getting-started, api-reference, customization, examples
- CI/CD: GitHub Actions for build, test, and npm publish
