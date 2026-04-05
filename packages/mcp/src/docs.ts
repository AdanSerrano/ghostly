/** All Ghostly documentation content for MCP tools */

export const COMPONENTS = {
  Ghostly: {
    name: 'Ghostly',
    description: 'Main skeleton wrapper. Wraps any component to show skeleton while loading.',
    import: "import { Ghostly } from '@ghostly-ui/react'",
    props: {
      loading: { type: 'boolean', required: true, description: 'Show skeleton effect' },
      animation: { type: "'shimmer' | 'pulse' | 'wave' | 'none'", default: "'shimmer'", description: 'Animation style' },
      radius: { type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'full'", default: "'sm'", description: 'Border radius' },
      speed: { type: "'slow' | 'normal' | 'fast'", default: "'normal'", description: 'Animation speed' },
      color: { type: 'string', description: 'Custom skeleton base color (CSS)' },
      shine: { type: 'string', description: 'Custom shimmer highlight color (CSS)' },
      smooth: { type: 'boolean', default: 'false', description: 'Fade-out transition when loading ends' },
      as: { type: "'div' | 'section' | 'article' | 'main' | 'aside' | 'span' | 'ul' | 'ol'", default: "'div'", description: 'HTML wrapper tag' },
      className: { type: 'string', description: 'CSS classes for wrapper' },
      style: { type: 'CSSProperties', description: 'Inline styles (merged with CSS vars)' },
    },
    example: `<Ghostly loading={isLoading} animation="shimmer" smooth>
  <ProductCard product={data} />
</Ghostly>`,
  },

  GhostlyList: {
    name: 'GhostlyList',
    description: 'Skeleton loader for lists and grids. Clones a template element N times during loading.',
    import: "import { GhostlyList } from '@ghostly-ui/react'",
    props: {
      loading: { type: 'boolean', required: true, description: 'Show skeleton items' },
      count: { type: 'number', required: true, description: 'Number of skeleton items' },
      item: { type: 'ReactElement', description: 'Template element to clone' },
      animation: { type: 'GhostlyAnimation', default: "'shimmer'" },
      radius: { type: 'GhostlyRadius', default: "'sm'" },
      speed: { type: 'GhostlySpeed', default: "'normal'" },
      color: { type: 'string', description: 'Custom skeleton color' },
      shine: { type: 'string', description: 'Custom shimmer highlight' },
      as: { type: "'div' | 'ul' | 'ol' | 'section' | 'main' | 'aside'", default: "'div'" },
    },
    example: `<GhostlyList
  loading={isLoading}
  count={6}
  item={<ProductCard />}
  className="grid grid-cols-3 gap-4"
>
  {products?.map(p => <ProductCard key={p.id} product={p} />)}
</GhostlyList>`,
  },

  GhostlySuspense: {
    name: 'GhostlySuspense',
    description: 'React Suspense wrapper with automatic skeleton fallback. Zero loading state management.',
    import: "import { GhostlySuspense } from '@ghostly-ui/react'",
    props: {
      fallback: { type: 'ReactElement', required: true, description: 'Template shown as skeleton while suspended' },
      animation: { type: 'GhostlyAnimation', default: "'shimmer'" },
      radius: { type: 'GhostlyRadius', default: "'sm'" },
      speed: { type: 'GhostlySpeed', default: "'normal'" },
      color: { type: 'string', description: 'Custom skeleton color' },
      shine: { type: 'string', description: 'Custom shimmer highlight' },
      smooth: { type: 'boolean', default: 'false', description: 'Fade-out when content resolves' },
      as: { type: "'div' | 'section' | 'article' | 'main' | 'aside'", default: "'div'" },
      className: { type: 'string' },
    },
    example: `<GhostlySuspense fallback={<ProductCard />} animation="shimmer" smooth>
  <AsyncProductCard id={123} />
</GhostlySuspense>`,
  },

  GhostlyProvider: {
    name: 'GhostlyProvider',
    description: 'Global config provider. Nested providers inherit from parent.',
    import: "import { GhostlyProvider } from '@ghostly-ui/react'",
    props: {
      animation: { type: 'GhostlyAnimation', default: "inherited or 'shimmer'" },
      radius: { type: 'GhostlyRadius', default: "inherited or 'sm'" },
      speed: { type: 'GhostlySpeed', default: "inherited or 'normal'" },
    },
    example: `<GhostlyProvider animation="shimmer" radius="md">
  <App />
</GhostlyProvider>`,
  },

  useGhostly: {
    name: 'useGhostly',
    description: 'Hook to read nearest Ghostly context and get spreadable skeleton props.',
    import: "import { useGhostly } from '@ghostly-ui/react'",
    props: {},
    example: `const { loading, animation, getGhostlyProps } = useGhostly()

// Spread onto any element for manual skeleton control
<div {...getGhostlyProps()}>
  <canvas />
</div>`,
  },
} as const

export const INSTALLATION = `## Install

\`\`\`bash
npm install @ghostly-ui/core @ghostly-ui/react
\`\`\`

## Setup

1. Import CSS in your globals.css:
\`\`\`css
@import '@ghostly-ui/core/css';
\`\`\`

2. Wrap your components:
\`\`\`tsx
import { Ghostly } from '@ghostly-ui/react'

<Ghostly loading={isLoading}>
  <YourComponent data={data} />
</Ghostly>
\`\`\`

## Optional: Global config
\`\`\`tsx
import { GhostlyProvider } from '@ghostly-ui/react'

<GhostlyProvider animation="shimmer" radius="md">
  <App />
</GhostlyProvider>
\`\`\`

## Optional: Tailwind plugin
\`\`\`js
import ghostly from '@ghostly-ui/core/tailwind'
export default { plugins: [ghostly] }
\`\`\`
`

export const CSS_REFERENCE = `## CSS Custom Properties

\`\`\`css
:root {
  --ghostly-color: hsl(220 13% 87%);   /* skeleton base color */
  --ghostly-shine: hsl(220 13% 94%);   /* shimmer highlight */
  --ghostly-radius: 4px;                /* border radius */
  --ghostly-speed: 1.5s;                /* animation duration */
  --ghostly-transition: 0.3s;           /* fade-out transition */
}
\`\`\`

## Dark Mode (automatic)
Detects via: .dark class, data-theme="dark", prefers-color-scheme: dark

## Animations
- **shimmer** — gradient sweep left to right
- **pulse** — opacity fade 100% ↔ 40%
- **wave** — staggered pulse across children

## Data Attributes
- \`data-ghostly="shimmer|pulse|wave"\` — activate skeleton
- \`data-ghostly-ignore\` — exclude element from skeleton
- \`data-ghostly-lines="1-8"\` — control text line count
- \`data-ghostly-ratio="16/9"\` — image aspect ratio (1/1, 4/3, 16/9, 21/9, 3/4, 9/16)
- \`data-ghostly-smooth\` — enable fade-out transition

## Accessibility
- \`aria-busy="true"\` set during loading
- \`aria-live="polite"\` always set
- \`prefers-reduced-motion: reduce\` disables animations
`

export const EXAMPLES = `## Single component
\`\`\`tsx
<Ghostly loading={isLoading} smooth>
  <UserCard user={data} />
</Ghostly>
\`\`\`

## Product grid
\`\`\`tsx
<GhostlyList loading={isLoading} count={8} item={<ProductCard />}
  className="grid grid-cols-4 gap-4">
  {products?.map(p => <ProductCard key={p.id} product={p} />)}
</GhostlyList>
\`\`\`

## Suspense (zero state management)
\`\`\`tsx
<GhostlySuspense fallback={<ProductCard />} smooth>
  <AsyncProductCard id={123} />
</GhostlySuspense>
\`\`\`

## Custom colors
\`\`\`tsx
<Ghostly loading color="hsl(260 60% 88%)" shine="hsl(260 60% 94%)">
  <SpecialSection />
</Ghostly>
\`\`\`

## Exclude elements
\`\`\`tsx
<Ghostly loading={isLoading}>
  <div>
    <h3>{data?.title ?? ''}</h3>
    <button data-ghostly-ignore>Always visible</button>
  </div>
</Ghostly>
\`\`\`

## Control line count
\`\`\`html
<p data-ghostly-lines="1">Short label</p>
<p data-ghostly-lines="5">Long paragraph</p>
\`\`\`

## Semantic lists
\`\`\`tsx
<GhostlyList loading={isLoading} count={5} item={<Todo />} as="ul">
  {todos.map(t => <Todo key={t.id} todo={t} />)}
</GhostlyList>
\`\`\`

## useGhostly for custom elements
\`\`\`tsx
function Widget() {
  const { getGhostlyProps } = useGhostly()
  return <div {...getGhostlyProps()}><canvas /></div>
}
\`\`\`
`
