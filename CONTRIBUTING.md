# Contributing to Ghostly

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/AdanSerrano/ghostly.git
cd ghostly

# Install dependencies (requires bun >= 1.2)
bun install

# Build all packages
bun run build

# Start the playground
bun run dev
```

## Project Structure

```
packages/core/     → CSS + TypeScript types (zero dependencies)
packages/react/    → React components (<Ghostly>, <GhostlyList>, <GhostlyProvider>)
playground/        → Next.js demo app for visual testing (port 3333)
docs/              → Documentation
```

## Development Workflow

1. **Make changes** in `packages/core/src/` or `packages/react/src/`
2. **Rebuild** the affected package: `bun run build:core` or `bun run build:react`
3. **Test visually** in the playground: `bun run dev`
4. **Run tests**: `bun run test`
5. **Type check**: `bun run type-check`

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(core): add new wave animation
fix(react): handle undefined children in GhostlyList
docs: update API reference with new props
```

Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `style`, `test`, `build`, `ci`, `chore`

Scopes: `core`, `react`, `playground`, `docs`, `deps`, `repo`

## CSS Guidelines

- All skeleton logic lives in `ghostly.css` — no JS-driven styles
- Use `:where()` for low specificity (easy to override)
- Use CSS custom properties for configurable values
- Always include `prefers-reduced-motion: reduce` for new animations
- Test both light and dark modes

## Pull Requests

1. Fork the repo and create a branch from `main`
2. Follow the commit convention
3. Ensure `bun run build` and `bun run test` pass
4. Update documentation if you changed the API
5. Open a PR with a clear description

## Adding a New Animation

1. Add `@keyframes` in `packages/core/src/ghostly.css`
2. Add the animation name to `GhostlyAnimation` type in `packages/core/src/types.ts`
3. Add CSS rule for `[data-ghostly='youranimation']`
4. Add a button in the playground to test it
5. Document in `docs/customization.md`

## Adding Framework Support

1. Create `packages/yourframework/`
2. Depend on `@ghostly-ui/core` package
3. Implement wrapper components that set `data-ghostly` attribute
4. Add build config (tsup)
5. Add to CI workflow

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
