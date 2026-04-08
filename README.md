# Ghostly

**Zero-config skeleton loaders for React, Vue, and Svelte.**

Wrap your component. Import the CSS. Done. No CLI, no build step, no code changes.

```tsx
import { Ghostly } from '@ghostly-ui/react'
import '@ghostly-ui/core/css'

<Ghostly loading={isLoading}>
  <ProductCard product={data} />
</Ghostly>
```

Your component **is** the skeleton. Ghostly uses pure CSS to transform your real layout into animated placeholder blocks — preserving the exact same structure, spacing, and dimensions.

## Install

```bash
# React
npm install @ghostly-ui/core @ghostly-ui/react

# Vue 3
npm install @ghostly-ui/core @ghostly-ui/vue

# Svelte
npm install @ghostly-ui/core @ghostly-ui/svelte
```

## Setup

**1. Import the CSS** (once, in your global stylesheet or root layout):

```css
@import '@ghostly-ui/core/css';
```

**2. Wrap your components:**

**React:**
```tsx
<Ghostly loading={isLoading}>
  <YourComponent data={data} />
</Ghostly>
```

**Vue:**
```vue
<Ghostly :loading="isLoading">
  <YourComponent :data="data" />
</Ghostly>
```

**Svelte:**
```svelte
<div use:ghostly={{ loading: isLoading }}>
  <YourComponent {data} />
</div>
```

That's it. Two steps. No config files. No CLI commands.

## Features

- **Zero config** — No build step, no CLI, no generated files
- **CSS-first** — All skeleton logic is pure CSS. Zero runtime overhead
- **Zero code changes** — Your existing components work as-is
- **3 animations** — Shimmer, pulse, wave
- **Dark mode** — Automatic via CSS (`.dark` class, `data-theme`, or system preference)
- **Accessible** — `aria-busy`, `aria-live`, `prefers-reduced-motion` support
- **Tiny** — ~2KB CSS + ~3KB adapter (gzipped)
- **Customizable** — CSS custom properties for colors, radius, speed
- **TypeScript** — Full type safety
- **Multi-framework** — React, Vue 3, and Svelte adapters
- **Smooth transitions** — Staggered reveal animation when loading ends
- **Smart loading** — `useGhostlyState` prevents skeleton flash on fast loads

## Components

### `<Ghostly>` — Wrap any component

```tsx
<Ghostly loading={isLoading} animation="shimmer" radius="md">
  <UserProfile user={data} />
</Ghostly>
```

### `<GhostlyList>` — For lists and grids

```tsx
<GhostlyList
  loading={isLoading}
  count={6}
  item={<ProductCard />}
  className="grid grid-cols-3 gap-4"
>
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</GhostlyList>
```

### `<GhostlyProvider>` — Global defaults

```tsx
<GhostlyProvider animation="shimmer" radius="md">
  <App />
</GhostlyProvider>
```

### `<GhostlySuspense>` — React Suspense integration

```tsx
<GhostlySuspense fallback={<ProductCard />}>
  <ProductCardWithData id={123} />
</GhostlySuspense>
```

## `useGhostlyState` — Prevent skeleton flash

When APIs respond in under 200ms, skeletons flash and disappear — jarring for users. `useGhostlyState` solves this:

```tsx
import { useGhostlyState } from '@ghostly-ui/react'

const { data, isLoading } = useSWR('/api/products', fetcher)
const showSkeleton = useGhostlyState(isLoading, {
  minimumMs: 400,    // Skeleton stays visible for at least 400ms
  delayMs: 100,      // Don't show skeleton if data arrives within 100ms
})

<Ghostly loading={showSkeleton}>
  <ProductCard product={data} />
</Ghostly>
```

Available for all frameworks:
- **React:** `useGhostlyState(isLoading, options)` hook
- **Vue:** `useGhostlyState(loadingRef, options)` composable
- **Svelte:** `createGhostlyState(options)` store

## Data attributes

| Attribute | Effect |
|-----------|--------|
| `data-ghostly-ignore` | Exclude element from skeleton |
| `data-ghostly-lines="N"` | Set text line count (1-8) with visible separations |
| `data-ghostly-ratio="16/9"` | Set aspect ratio for media |

### Exclude elements

```tsx
<Ghostly loading={true}>
  <Card>
    <h2>This is a skeleton</h2>
    <button data-ghostly-ignore>Always visible</button>
  </Card>
</Ghostly>
```

## Animations

| Animation | Description |
|-----------|-------------|
| `shimmer` | Gradient sweep left to right (default) |
| `pulse` | Opacity fade in/out |
| `wave` | Staggered pulse across children |
| `none` | Static blocks, no animation |

## Smooth transitions

Enable staggered reveal — children fade in sequentially when loading ends:

```tsx
<Ghostly loading={isLoading} smooth>
  <Header />
  <Content />
  <Footer />
</Ghostly>
```

Customize the stagger delay:

```css
:root {
  --ghostly-stagger: 80ms; /* default: 50ms */
}
```

## Customization

Override CSS custom properties:

```css
:root {
  --ghostly-color: hsl(220 13% 87%);
  --ghostly-shine: hsl(220 13% 94%);
  --ghostly-radius: 4px;
  --ghostly-speed: 1.5s;
  --ghostly-stagger: 50ms;
}

.dark {
  --ghostly-color: hsl(220 13% 18%);
  --ghostly-shine: hsl(220 13% 25%);
}
```

Or per-instance via props:

```tsx
<Ghostly loading={true} color="#e0d4f5" shine="#f0e8ff">
  <StatsCard stat={data} />
</Ghostly>
```

## How it works

When `loading={true}`, Ghostly adds `data-ghostly="shimmer"` to the wrapper element. Pure CSS then:

1. Makes text elements transparent with a colored background
2. Hides media (img, svg, video) and replaces with skeleton backgrounds
3. Applies `min-height` to prevent empty elements from collapsing
4. Runs the chosen animation via `@keyframes`
5. Blocks pointer events and user selection

When `loading` becomes `false`, the attribute is removed. Your component renders normally. **No layout shift** because the skeleton uses the exact same layout as your real component.

## Packages

| Package | Description | Size |
|---------|-------------|------|
| [`@ghostly-ui/core`](./packages/core) | CSS + types (framework-agnostic) | ~2KB |
| [`@ghostly-ui/react`](./packages/react) | React components + hooks | ~3KB |
| [`@ghostly-ui/vue`](./packages/vue) | Vue 3 components + composables | ~3KB |
| [`@ghostly-ui/svelte`](./packages/svelte) | Svelte action + store | ~2KB |
| [`@ghostly-ui/cli`](./packages/cli) | CLI (init, generate, doctor) | — |
| [`@ghostly-ui/mcp`](./packages/mcp) | MCP server for AI assistants | — |

## Requirements

- **React:** >= 18
- **Vue:** >= 3.3
- **Svelte:** >= 4.0
- Any bundler that supports CSS imports (Next.js, Vite, Webpack, etc.)

## Documentation

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/reference/api.md)
- [CSS Reference](./docs/reference/css.md)
- [Customization](./docs/guides/customization.md)
- [Data Fetching](./docs/guides/data-fetching.md)
- [Accessibility](./docs/guides/accessibility.md)
- [How It Works](./docs/advanced/how-it-works.md)
- [Comparison](./docs/advanced/comparison.md)

## License

MIT
