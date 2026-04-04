# API Reference

## Components

### `<Ghostly>`

The main component. Wraps any content to show skeleton loaders while loading.

```tsx
import { Ghostly } from '@ghostly/react'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | **required** | When `true`, shows skeleton effect |
| `animation` | `'shimmer' \| 'pulse' \| 'wave' \| 'none'` | `'shimmer'` | Animation style |
| `radius` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'sm'` | Border radius of skeleton blocks |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Animation speed |
| `as` | `'div' \| 'section' \| 'article' \| 'main' \| 'aside' \| 'span'` | `'div'` | HTML tag for wrapper |
| `className` | `string` | — | CSS class for wrapper |
| `style` | `CSSProperties` | — | Inline styles (merged with Ghostly CSS vars) |

Plus all standard `HTMLDivElement` attributes.

#### Examples

```tsx
// Basic
<Ghostly loading={isLoading}>
  <UserProfile user={data} />
</Ghostly>

// With options
<Ghostly loading={isLoading} animation="pulse" radius="md" speed="fast">
  <UserProfile user={data} />
</Ghostly>

// Semantic wrapper
<Ghostly loading={isLoading} as="article">
  <BlogPost post={data} />
</Ghostly>
```

---

### `<GhostlyList>`

Skeleton loader for lists and grids. Renders N skeleton copies of a template while loading.

```tsx
import { GhostlyList } from '@ghostly/react'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | `boolean` | **required** | When `true`, shows skeleton items |
| `count` | `number` | **required** | Number of skeleton items to render |
| `item` | `ReactElement` | first child | Template element to clone as skeleton |
| `animation` | `'shimmer' \| 'pulse' \| 'wave' \| 'none'` | `'shimmer'` | Animation style |
| `radius` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'sm'` | Border radius |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Animation speed |
| `className` | `string` | — | CSS class for list container |

#### Examples

```tsx
// Grid of product cards
<GhostlyList
  loading={isLoading}
  count={6}
  item={<ProductCard />}
  className="grid grid-cols-3 gap-4"
>
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</GhostlyList>

// Vertical list
<GhostlyList
  loading={isLoading}
  count={5}
  item={<ListItem />}
  className="flex flex-col gap-2"
>
  {items.map(item => <ListItem key={item.id} data={item} />)}
</GhostlyList>
```

---

### `<GhostlyProvider>`

Sets default configuration for all `<Ghostly>` and `<GhostlyList>` descendants.

```tsx
import { GhostlyProvider } from '@ghostly/react'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animation` | `GhostlyAnimation` | `'shimmer'` | Default animation |
| `radius` | `GhostlyRadius` | `'sm'` | Default radius |
| `speed` | `GhostlySpeed` | `'normal'` | Default speed |

#### Example

```tsx
// In your root layout
<GhostlyProvider animation="shimmer" radius="md" speed="normal">
  <App />
</GhostlyProvider>
```

Individual `<Ghostly>` instances can still override these defaults via props.

---

## Hooks

### `useGhostly()`

Read the nearest Ghostly context (loading state + config).

```tsx
import { useGhostly } from '@ghostly/react'

function MyComponent() {
  const { loading, animation, radius, speed } = useGhostly()

  if (loading) {
    // Currently inside a loading Ghostly wrapper
  }
}
```

---

## HTML Attributes

### `data-ghostly-ignore`

Add this attribute to any element to exclude it (and its children) from the skeleton effect.

```tsx
<Ghostly loading={true}>
  <div>
    <h2>This becomes a skeleton</h2>
    <button data-ghostly-ignore>This stays visible</button>
  </div>
</Ghostly>
```

---

## CSS Custom Properties

Override these in your CSS to customize Ghostly globally:

```css
:root {
  --ghostly-color: hsl(220 13% 87%);   /* Base skeleton color */
  --ghostly-shine: hsl(220 13% 94%);   /* Shimmer highlight */
  --ghostly-radius: 4px;                /* Border radius */
  --ghostly-speed: 1.5s;                /* Animation duration */
}
```

---

## TypeScript Types

```tsx
import type {
  GhostlyAnimation,  // 'shimmer' | 'pulse' | 'wave' | 'none'
  GhostlyRadius,     // 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'full'
  GhostlySpeed,      // 'slow' | 'normal' | 'fast'
  GhostlyConfig,     // { animation?, radius?, speed? }
} from '@ghostly/react'
```
