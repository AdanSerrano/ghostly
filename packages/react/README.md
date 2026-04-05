# @ghostly-ui/react

React components for [Ghostly](https://github.com/AdanSerrano/ghostly) skeleton loaders.

> Zero-config. Wrap your component, done. No CLI, no build step, no code changes.

## Install

```bash
npm install @ghostly-ui/core @ghostly-ui/react
```

```css
/* globals.css */
@import '@ghostly-ui/core/css';
```

## Quick Start

```tsx
import { Ghostly } from '@ghostly-ui/react'

<Ghostly loading={isLoading} smooth>
  <ProductCard product={data} />
</Ghostly>
```

## Components

### `<Ghostly>` -- Wrap any component

```tsx
<Ghostly
  loading={isLoading}
  animation="shimmer"    // shimmer | pulse | wave | none
  radius="md"            // none | xs | sm | md | lg | full
  speed="normal"         // slow | normal | fast
  color="hsl(210 40% 88%)"  // custom skeleton color
  shine="hsl(210 40% 94%)"  // custom shimmer highlight
  smooth                 // fade-out transition
  as="article"           // div | section | article | main | aside | span | ul | ol
>
  <YourComponent data={data} />
</Ghostly>
```

### `<GhostlyList>` -- For lists and grids

```tsx
<GhostlyList
  loading={isLoading}
  count={6}
  item={<ProductCard />}
  as="ul"
  className="grid grid-cols-3 gap-4"
>
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</GhostlyList>
```

### `<GhostlySuspense>` -- Auto-skeleton with Suspense

Zero state management. Works with RSC, `use()`, and Suspense-based data fetching.

```tsx
import { GhostlySuspense } from '@ghostly-ui/react'

<GhostlySuspense fallback={<ProductCard />} animation="shimmer" smooth>
  <AsyncProductCard id={123} />
</GhostlySuspense>
```

### `<GhostlyProvider>` -- Global defaults

Nested providers inherit from parent. Only override what you need.

```tsx
<GhostlyProvider animation="shimmer" radius="md">
  <App />
</GhostlyProvider>
```

### `useGhostly()` -- Read context + spreadable props

```tsx
const { loading, animation, getGhostlyProps } = useGhostly()

// Spread onto any element for manual skeleton control
<div {...getGhostlyProps()}>
  <canvas />
</div>
```

## HTML Attributes

```html
<button data-ghostly-ignore>Always visible</button>
<p data-ghostly-lines="5">Long paragraph skeleton</p>
<img data-ghostly-ratio="1/1" src="avatar.jpg" />
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | required | Show skeleton |
| `animation` | `'shimmer' \| 'pulse' \| 'wave' \| 'none'` | `'shimmer'` | Animation style |
| `radius` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'sm'` | Border radius |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Animation speed |
| `color` | `string` | -- | Custom skeleton base color |
| `shine` | `string` | -- | Custom shimmer highlight |
| `smooth` | `boolean` | `false` | Fade-out transition |
| `as` | `string` | `'div'` | Wrapper HTML tag |

## Documentation

Full docs at [ghostly.adanulissess.com](https://ghostly.adanulissess.com)

## License

MIT
