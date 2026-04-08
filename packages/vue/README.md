# @ghostly-ui/vue

Vue 3 components for [Ghostly](https://github.com/AdanSerrano/ghostly) -- zero-config skeleton loaders.

Wrap your component, import the CSS, done. No duplicate markup, no manual sizing.

## Install

```bash
npm install @ghostly-ui/core @ghostly-ui/vue
```

## Setup

Import the CSS once in your app entry (e.g., `main.ts`):

```ts
import '@ghostly-ui/core/css'
```

## Usage

### Basic

```vue
<script setup>
import { Ghostly } from '@ghostly-ui/vue'
import { ref } from 'vue'

const loading = ref(true)
</script>

<template>
  <Ghostly :loading="loading">
    <div class="flex gap-4">
      <img src="/avatar.jpg" class="w-12 h-12 rounded-full" />
      <div>
        <h3>John Doe</h3>
        <p>Software Engineer</p>
      </div>
    </div>
  </Ghostly>
</template>
```

### Lists

```vue
<script setup>
import { GhostlyList } from '@ghostly-ui/vue'
</script>

<template>
  <GhostlyList :loading="loading" :count="6" class="grid grid-cols-3 gap-4">
    <template #item>
      <ProductCard />
    </template>
    <ProductCard v-for="p in products" :key="p.id" :product="p" />
  </GhostlyList>
</template>
```

### Global Config

```vue
<script setup>
import { GhostlyProvider } from '@ghostly-ui/vue'
</script>

<template>
  <GhostlyProvider animation="pulse" radius="md">
    <App />
  </GhostlyProvider>
</template>
```

### Minimum Display Time

```vue
<script setup>
import { useGhostlyState } from '@ghostly-ui/vue'
import { ref } from 'vue'

const rawLoading = ref(true)
const loading = useGhostlyState(rawLoading, { minimumMs: 400, delayMs: 100 })
</script>

<template>
  <Ghostly :loading="loading.value">
    <ProductCard :product="data" />
  </Ghostly>
</template>
```

## API

### Components

| Component | Props | Description |
|-----------|-------|-------------|
| `Ghostly` | `loading` (required), `animation`, `radius`, `speed`, `color`, `shine`, `as`, `smooth` | Main skeleton wrapper |
| `GhostlyList` | `loading`, `count` (required), `animation`, `radius`, `speed`, `color`, `shine`, `as` | List/grid skeleton |
| `GhostlyProvider` | `animation`, `radius`, `speed` | Global config via provide/inject |

### Composables

| Composable | Returns | Description |
|------------|---------|-------------|
| `useGhostly()` | `{ animation, radius, speed, getGhostlyProps }` | Read nearest provider config |
| `useGhostlyState(isLoading, options?)` | `Ref<boolean>` | Debounced loading with min display time |

### Animations

| Value | Effect |
|-------|--------|
| `shimmer` | Gradient sweep left-to-right (default) |
| `pulse` | Opacity fade in/out |
| `wave` | Staggered opacity per child |
| `none` | Static skeleton, no animation |

## Requirements

- Vue >= 3.3
- `@ghostly-ui/core` >= 1.0.0

## License

MIT
