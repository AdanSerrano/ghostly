# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- **New CSS elements** -- `time`, `abbr`, `sub`, `sup`, `del`, `ins` now supported as skeleton targets.

### Changed

- **Provider inheritance** -- Nested `<GhostlyProvider>` now merges with parent values instead of resetting to defaults.
- **Image aspect ratio** -- Images without explicit dimensions now use `aspect-ratio: 16/9` instead of fixed `min-height: 12rem`.
- **`GhostlyConfig` type** -- Now includes `color` and `shine` optional fields.

### Fixed

- Website build errors in `api/search/route.ts` and `lib/source.ts`.

## [0.1.0] - 2026-03-28

### Added

- `@ghostly-ui/core` package with CSS-first skeleton engine
  - 3 animations: shimmer, pulse, wave
  - Automatic dark mode detection (`.dark`, `data-theme`, `prefers-color-scheme`)
  - CSS custom properties for customization (`--ghostly-color`, `--ghostly-shine`, `--ghostly-radius`, `--ghostly-speed`)
  - `prefers-reduced-motion: reduce` support
  - `data-ghostly-ignore` attribute for exclusions
  - Semantic min-height defaults for headings, paragraphs, buttons, inputs
- `@ghostly-ui/react` package with React components
  - `<Ghostly>` -- main wrapper component
  - `<GhostlyList>` -- skeleton loader for lists and grids
  - `<GhostlyProvider>` -- global configuration provider
  - `useGhostly()` hook for reading context
- Playground app (Next.js) with interactive demo
- Documentation site with Fumadocs
- 100% test coverage with vitest
