# Getting Started

## Installation

```bash
# npm
npm install ghostly @ghostly/react

# yarn
yarn add ghostly @ghostly/react

# pnpm
pnpm add ghostly @ghostly/react

# bun
bun add ghostly @ghostly/react
```

## Setup (2 steps)

### Step 1: Import the CSS

Add the Ghostly stylesheet to your app's global CSS file:

```css
/* globals.css or app.css */
@import 'ghostly/css';
```

Or import it in your root layout/component:

```tsx
// layout.tsx or App.tsx
import 'ghostly/css'
```

### Step 2: Wrap your components

```tsx
import { Ghostly } from '@ghostly/react'

function MyPage() {
  const { data, isLoading } = useFetch('/api/products')

  return (
    <Ghostly loading={isLoading}>
      <ProductCard product={data} />
    </Ghostly>
  )
}
```

**That's it.** No CLI. No build step. No config files. No code changes to your components.

## How it works

When `loading` is `true`, Ghostly adds a `data-ghostly` attribute to the wrapper. Pure CSS rules then:

1. Make text elements transparent with a colored background (skeleton block)
2. Hide images/SVGs and replace them with a pseudo-element skeleton
3. Apply the chosen animation (shimmer, pulse, or wave)
4. Block pointer events and user selection

When `loading` becomes `false`, the attribute is removed and your component renders normally.

## Important: Handle undefined props

Your components should handle `undefined` or missing data gracefully:

```tsx
// Good — uses optional chaining
function ProductCard({ product }: { product?: Product }) {
  return (
    <div>
      <h2>{product?.title ?? ''}</h2>
      <p>{product?.price ?? ''}</p>
    </div>
  )
}

// Bad — crashes when product is undefined
function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <h2>{product.title}</h2>  {/* TypeError! */}
    </div>
  )
}
```

This is standard React best practice — components that handle optional props work with Suspense, loading states, and Ghostly seamlessly.

## Next Steps

- [API Reference](./api-reference.md) — All components and props
- [Customization](./customization.md) — Colors, animations, theming
- [Examples](./examples.md) — Common patterns and use cases
