# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.4] - 2026-04-05

### Added

- **`@ghostly-ui/cli`** -- CLI tool with three commands:
  - `ghostly init` -- interactive setup wizard (installs packages, adds CSS, configures provider and Tailwind)
  - `ghostly add loading [path]` -- auto-generates `loading.tsx` by analyzing page components, detecting list patterns
  - `ghostly doctor` -- health check for Ghostly setup (packages, CSS, provider, loading.tsx coverage)
- **`@ghostly-ui/mcp`** -- MCP server for AI assistants (Claude, Cursor, Copilot) with 6 tools

### Fixed

- **CSS layout fidelity** -- Skeleton now matches component layout exactly:
  - Uses `::before` with invisible non-breaking spaces to prevent text collapse
  - Uses `:has()` to surgically expand only text-containing flex children
  - Never overrides border-radius, dimensions, or layout properties
  - Safe for sidebars, grids, fixed-width columns, any layout system
- **Border-radius preservation** -- Uses `@layer ghostly-defaults` so component CSS always wins
- **Empty div styling** -- Placeholder divs (avatars, icons) get skeleton background automatically

## [0.2.0] - 2026-04-04

### Added

- **`<GhostlySuspense>`** -- React Suspense wrapper with automatic skeleton fallback. Zero loading state management.
- **`color` and `shine` props** -- Customize skeleton colors per-instance without CSS overrides.
- **`smooth` prop** -- Fade-out CSS transition when loading ends (`--ghostly-transition: 0.3s`).
- **`as` prop on `<GhostlyList>`** -- Support `ul`, `ol`, `section`, `main`, `aside` wrappers.
- **`ul` and `ol` support** for `<Ghostly>` `as` prop.
- **`data-ghostly-lines`** -- Control skeleton text line count (1-8).
- **`data-ghostly-ratio`** -- Aspect ratio presets for images (1/1, 4/3, 16/9, 21/9, 3/4, 9/16).
- **`getGhostlyProps()`** -- Spreadable props helper returned by `useGhostly()`.
- **Tailwind CSS plugin** (`@ghostly-ui/core/tailwind`) -- `ghostly-radius-*`, `ghostly-speed-*`, `ghostly-color-[...]`, `ghostly-shine-[...]` utilities and `ghostly:` variant.
- **Dev mode validation** -- `console.warn` for invalid `animation`, `radius`, or `speed` values.

### Changed

- **Provider inheritance** -- Nested `<GhostlyProvider>` now merges with parent values instead of resetting to defaults.
- **Image aspect ratio** -- Images without explicit dimensions now use `aspect-ratio: 16/9` instead of fixed `min-height: 12rem`.
- **`GhostlyConfig` type** -- Now includes `color` and `shine` optional fields.

## [0.1.0] - 2026-03-28

### Added

- `@ghostly-ui/core` package with CSS-first skeleton engine
  - 3 animations: shimmer, pulse, wave
  - Automatic dark mode detection (`.dark`, `data-theme`, `prefers-color-scheme`)
  - CSS custom properties for customization
  - `prefers-reduced-motion: reduce` support
  - `data-ghostly-ignore` attribute for exclusions
- `@ghostly-ui/react` package with React components
  - `<Ghostly>` -- main wrapper component
  - `<GhostlyList>` -- skeleton loader for lists and grids
  - `<GhostlyProvider>` -- global configuration provider
  - `useGhostly()` hook for reading context
- 100% test coverage with vitest
