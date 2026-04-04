# Ghostly

**Zero-config skeleton loaders for React.**

Wrap your component. Import the CSS. Done. No CLI, no build step, no code changes.

```tsx
import { Ghostly } from '@ghostly/react'
import 'ghostly/css'

<Ghostly loading={isLoading}>
  <ProductCard product={data} />
</Ghostly>
```

Your component **is** the skeleton. Ghostly uses pure CSS to transform your real layout into animated placeholder blocks — preserving the exact same structure, spacing, and dimensions.

## Install

```bash
npm install ghostly @ghostly/react
```

## Setup

**1. Import the CSS** (once, in your global stylesheet or root layout):

```css
@import 'ghostly/css';
```

**2. Wrap your components:**

```tsx
<Ghostly loading={isLoading}>
  <YourComponent data={data} />
</Ghostly>
```

That's it. Two steps. No config files. No CLI commands.

## Features

- **Zero config** — No build step, no CLI, no generated files
- **CSS-first** — All skeleton logic is pure CSS. Zero runtime overhead
- **Zero code changes** — Your existing components work as-is
- **3 animations** — Shimmer, pulse, wave
- **Dark mode** — Automatic via CSS (`.dark` class, `data-theme`, or system preference)
- **Accessible** — `aria-busy`, `aria-live`, `prefers-reduced-motion` support
- **Tiny** — ~2KB CSS, ~3KB React (gzipped)
- **Customizable** — CSS custom properties for colors, radius, speed
- **TypeScript** — Full type safety

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

## Customization

Override CSS custom properties:

```css
:root {
  --ghostly-color: hsl(220 13% 87%);
  --ghostly-shine: hsl(220 13% 94%);
  --ghostly-radius: 4px;
  --ghostly-speed: 1.5s;
}

.dark {
  --ghostly-color: hsl(220 13% 18%);
  --ghostly-shine: hsl(220 13% 25%);
}
```

## How it works

When `loading={true}`, Ghostly adds `data-ghostly="shimmer"` to the wrapper element. Pure CSS then:

1. Makes text elements transparent with a colored background
2. Hides media (img, svg, video) and replaces with pseudo-element skeletons
3. Applies `min-height` to prevent empty elements from collapsing
4. Runs the chosen animation via `@keyframes`
5. Blocks pointer events and user selection

When `loading` becomes `false`, the attribute is removed. Your component renders normally. **No layout shift** because the skeleton uses the exact same layout as your real component.

## Requirements

- React >= 18
- Any bundler that supports CSS imports (Next.js, Vite, Webpack, etc.)

## Documentation

- [Getting Started](./docs/getting-started.md)
- [API Reference](./docs/api-reference.md)
- [Customization](./docs/customization.md)
- [Examples](./docs/examples.md)

## License

MIT
