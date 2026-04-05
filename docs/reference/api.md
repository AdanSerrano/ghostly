# API Reference

Complete reference for all Ghostly React components, hooks, and types.

---

## Components

### `<Ghostly>`

The primary component. Wraps any content to display skeleton loaders while data is loading.

```tsx
import { Ghostly } from '@ghostly-ui/react'
```

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `loading` | `boolean` | — | Yes | When `true`, all content inside becomes skeleton blocks |
| `animation` | `GhostlyAnimation` | `'shimmer'` | No | Animation style for skeleton blocks |
| `radius` | `GhostlyRadius` | `'sm'` | No | Border radius applied to skeleton blocks |
| `speed` | `GhostlySpeed` | `'normal'` | No | Animation duration |
| `as` | `'div' \| 'section' \| 'article' \| 'main' \| 'aside' \| 'span'` | `'div'` | No | HTML element for the wrapper |
| `className` | `string` | — | No | CSS classes passed to the wrapper element |
| `style` | `React.CSSProperties` | — | No | Inline styles (merged with Ghostly CSS variables) |
| `children` | `ReactNode` | — | Yes | Content to display or skeletonize |

All standard `HTMLDivElement` attributes (`id`, `data-*`, `role`, etc.) are also accepted and forwarded to the wrapper.

#### Behavior

- When `loading={true}`:
  - Sets `data-ghostly="{animation}"` on the wrapper
  - Sets `aria-busy="true"` for accessibility
  - Sets CSS custom properties for radius and speed
  - All descendant text/media elements become skeleton blocks via CSS

- When `loading={false}`:
  - Removes `data-ghostly` attribute
  - Removes `aria-busy`
  - Children render normally

#### Context

`<Ghostly>` provides a context to descendants with the current `loading` state and config. Nested `<Ghostly>` components override the parent context.

#### Examples

```tsx
// Basic usage
<Ghostly loading={isLoading}>
  <UserCard user={data} />
</Ghostly>

// With all options
<Ghostly
  loading={isLoading}
  animation="pulse"
  radius="lg"
  speed="fast"
  as="article"
  className="my-card-skeleton"
>
  <BlogPost post={data} />
</Ghostly>

// Custom CSS variables per instance
<Ghostly
  loading={true}
  style={{
    '--ghostly-color': 'hsl(260 30% 88%)',
    '--ghostly-shine': 'hsl(260 30% 94%)',
  } as React.CSSProperties}
>
  <SpecialSection data={data} />
</Ghostly>
```

---

### `<GhostlyList>`

Specialized component for rendering skeleton loaders in lists and grids. Clones a template element N times during loading.

```tsx
import { GhostlyList } from '@ghostly-ui/react'
```

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `loading` | `boolean` | — | Yes | When `true`, shows skeleton items |
| `count` | `number` | — | Yes | Number of skeleton items to render |
| `item` | `ReactElement` | first child | No | Template element to clone as each skeleton item |
| `animation` | `GhostlyAnimation` | `'shimmer'` | No | Animation style |
| `radius` | `GhostlyRadius` | `'sm'` | No | Border radius |
| `speed` | `GhostlySpeed` | `'normal'` | No | Animation speed |
| `className` | `string` | — | No | CSS classes for the list container |
| `children` | `ReactNode` | — | Yes | Real content when not loading |

#### Behavior

- When `loading={true}`:
  - Ignores `children`
  - Clones `item` (or the first child element if `item` is omitted) `count` times
  - Wraps clones in a `<Ghostly loading={true}>` wrapper
  - Each clone gets a unique key (`ghostly-item-{index}`)

- When `loading={false}`:
  - Renders `children` inside a plain `<div>`
  - No skeleton logic applied

#### Why use GhostlyList instead of Ghostly?

When your data is an array that starts empty (`[]`), wrapping with `<Ghostly>` would show an empty container — there's nothing to skeletonize. `<GhostlyList>` solves this by rendering N copies of a template component.

#### Examples

```tsx
// Product grid
<GhostlyList
  loading={isLoading}
  count={8}
  item={<ProductCard />}
  className="grid grid-cols-2 gap-4 md:grid-cols-4"
>
  {products?.map(p => <ProductCard key={p.id} product={p} />)}
</GhostlyList>

// Table rows
<GhostlyList
  loading={isLoading}
  count={10}
  item={<OrderRow />}
  className="divide-y divide-gray-200"
>
  {orders?.map(o => <OrderRow key={o.id} order={o} />)}
</GhostlyList>

// Without explicit item (uses first child as template)
<GhostlyList loading={isLoading} count={5} className="space-y-2">
  {notifications?.map(n => <NotificationItem key={n.id} data={n} />)}
</GhostlyList>
```

---

### `<GhostlyProvider>`

Sets default configuration values for all `<Ghostly>` and `<GhostlyList>` descendants. Place it at the root of your app.

```tsx
import { GhostlyProvider } from '@ghostly-ui/react'
```

#### Props

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `animation` | `GhostlyAnimation` | `'shimmer'` | No | Default animation for all descendants |
| `radius` | `GhostlyRadius` | `'sm'` | No | Default border radius |
| `speed` | `GhostlySpeed` | `'normal'` | No | Default animation speed |
| `children` | `ReactNode` | — | Yes | App content |

#### Priority order

Props on individual `<Ghostly>` instances override `<GhostlyProvider>` values:

```
Instance props > GhostlyProvider > Built-in defaults
```

#### Example

```tsx
// app/layout.tsx
import { GhostlyProvider } from '@ghostly-ui/react'
import '@ghostly-ui/core/css'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <GhostlyProvider animation="shimmer" radius="md" speed="normal">
          {children}
        </GhostlyProvider>
      </body>
    </html>
  )
}
```

---

## Hooks

### `useGhostly()`

Returns the current Ghostly context value from the nearest `<Ghostly>` or `<GhostlyProvider>` ancestor.

```tsx
import { useGhostly } from '@ghostly-ui/react'
```

#### Return value

```tsx
interface GhostlyContextValue {
  loading: boolean          // Whether the nearest Ghostly ancestor is loading
  animation: GhostlyAnimation  // Current animation
  radius: GhostlyRadius        // Current radius
  speed: GhostlySpeed          // Current speed
}
```

#### Use cases

- Conditionally render content based on loading state
- Build custom skeleton-aware components
- Read the current config for custom skeleton implementations

#### Example

```tsx
function StatusBadge({ status }: { status?: string }) {
  const { loading } = useGhostly()

  if (loading) {
    return <div className="h-6 w-16 rounded-full bg-gray-200" />
  }

  return (
    <span className={`badge badge-${status}`}>
      {status}
    </span>
  )
}
```

---

## Types

All types are exported from both `@ghostly-ui/core` and `@ghostly-ui/react`.

### `GhostlyAnimation`

```tsx
type GhostlyAnimation = 'shimmer' | 'pulse' | 'wave' | 'none'
```

| Value | Description |
|-------|-------------|
| `'shimmer'` | Gradient sweep left to right. The industry standard (Facebook, LinkedIn, YouTube) |
| `'pulse'` | Opacity fades in and out. Subtle and minimal |
| `'wave'` | Like pulse, but children are staggered (each starts slightly later) |
| `'none'` | Static skeleton blocks with no animation |

### `GhostlyRadius`

```tsx
type GhostlyRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'full'
```

| Value | CSS Output |
|-------|-----------|
| `'none'` | `0px` |
| `'xs'` | `2px` |
| `'sm'` | `4px` |
| `'md'` | `8px` |
| `'lg'` | `12px` |
| `'full'` | `9999px` |

### `GhostlySpeed`

```tsx
type GhostlySpeed = 'slow' | 'normal' | 'fast'
```

| Value | CSS Output |
|-------|-----------|
| `'slow'` | `2s` |
| `'normal'` | `1.5s` |
| `'fast'` | `0.8s` |

### `GhostlyConfig`

```tsx
interface GhostlyConfig {
  animation?: GhostlyAnimation
  radius?: GhostlyRadius
  speed?: GhostlySpeed
}
```

### Constants

```tsx
import { CSS_VARS, RADIUS_MAP, SPEED_MAP } from '@ghostly-ui/core'

CSS_VARS.color   // '--ghostly-color'
CSS_VARS.shine   // '--ghostly-shine'
CSS_VARS.radius  // '--ghostly-radius'
CSS_VARS.speed   // '--ghostly-speed'

RADIUS_MAP.md    // '8px'
SPEED_MAP.fast   // '0.8s'
```
