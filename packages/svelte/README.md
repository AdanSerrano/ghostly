# @ghostly-ui/svelte

Svelte adapter for [Ghostly](https://github.com/AdanSerrano/ghostly) -- zero-config skeleton loaders.

Uses Svelte actions and stores for a framework-idiomatic API. No duplicate markup, no manual sizing.

## Install

```bash
npm install @ghostly-ui/core @ghostly-ui/svelte
```

## Setup

Import the CSS once in your app entry or layout:

```ts
import '@ghostly-ui/core/css'
```

## Usage

### Basic (Svelte Action)

```svelte
<script>
  import { ghostly } from '@ghostly-ui/svelte'

  let loading = $state(true)
</script>

<div use:ghostly={{ loading, animation: 'shimmer' }}>
  <div class="flex gap-4">
    <img src="/avatar.jpg" class="w-12 h-12 rounded-full" />
    <div>
      <h3>John Doe</h3>
      <p>Software Engineer</p>
    </div>
  </div>
</div>
```

### With Smooth Transition

```svelte
<div use:ghostly={{ loading, smooth: true, animation: 'pulse' }}>
  <ProductCard {product} />
</div>
```

### Custom Colors

```svelte
<div use:ghostly={{ loading, color: '#e0d4f5', shine: '#f0e8ff' }}>
  <StatsCard {stat} />
</div>
```

### Minimum Display Time

```svelte
<script>
  import { createGhostlyState, ghostly } from '@ghostly-ui/svelte'

  const skeleton = createGhostlyState({ minimumMs: 400, delayMs: 100 })

  let loading = $state(false)
  $effect(() => skeleton.subscribe(v => loading = v))

  async function fetchData() {
    skeleton.setLoading(true)
    const data = await fetch('/api/products').then(r => r.json())
    skeleton.setLoading(false)
  }
</script>

<div use:ghostly={{ loading }}>
  <ProductList {products} />
</div>
```

## API

### Action

```ts
use:ghostly={params}
```

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `loading` | `boolean` | required | Show/hide skeleton |
| `animation` | `'shimmer' \| 'pulse' \| 'wave' \| 'none'` | `'shimmer'` | Animation style |
| `radius` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'sm'` | Border radius |
| `speed` | `'slow' \| 'normal' \| 'fast'` | `'normal'` | Animation speed |
| `color` | `string` | -- | Custom skeleton color |
| `shine` | `string` | -- | Custom shimmer highlight |
| `smooth` | `boolean` | `false` | Enable fade-out transition |

### Store

```ts
const { subscribe, setLoading, destroy } = createGhostlyState(options?)
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `minimumMs` | `number` | `300` | Min skeleton display time |
| `delayMs` | `number` | `0` | Delay before showing skeleton |
| `onTransitionEnd` | `() => void` | -- | Callback when skeleton hides |

## HTML Attributes

These work automatically with the `ghostly` action:

| Attribute | Effect |
|-----------|--------|
| `data-ghostly-ignore` | Exclude element from skeleton |
| `data-ghostly-lines="N"` | Set text line count (1-8) |
| `data-ghostly-ratio="16/9"` | Set aspect ratio |

## Requirements

- Svelte >= 4.0
- `@ghostly-ui/core` >= 1.0.0

## License

MIT
