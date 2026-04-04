# @ghostly/react

React components for [Ghostly](https://github.com/AdanSerrano/ghostly) skeleton loaders.

Zero-config. Wrap your component, done.

## Install

```bash
npm install ghostly @ghostly/react
```

## Setup

```css
/* globals.css */
@import 'ghostly/css';
```

## Usage

```tsx
import { Ghostly } from '@ghostly/react'

<Ghostly loading={isLoading}>
  <ProductCard product={data} />
</Ghostly>
```

## Components

### `<Ghostly>` — Wrap any component

```tsx
<Ghostly loading={isLoading} animation="shimmer" radius="md">
  <YourComponent data={data} />
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

### `useGhostly()` — Read context

```tsx
const { loading, animation } = useGhostly()
```

### Exclude elements

```html
<button data-ghostly-ignore>Always visible</button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | required | Show skeleton |
| `animation` | `'shimmer' \| 'pulse' \| 'wave' \| 'none'` | `'shimmer'` | Animation |
| `radius` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'sm'` | Border radius |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Speed |

## License

MIT
