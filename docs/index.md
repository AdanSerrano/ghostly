# Ghostly Documentation

> Zero-config skeleton loaders for React. Wrap your component, done.

## Quick Links

### Getting Started
- [Installation & Setup](./getting-started.md) — 2-step setup, start in 30 seconds
- [Examples](./examples.md) — Common patterns and real-world use cases

### Reference
- [API Reference](./reference/api.md) — Components, hooks, props, types
- [CSS Reference](./reference/css.md) — Custom properties, selectors, specificity
- [HTML Attributes](./reference/attributes.md) — data-ghostly, data-ghostly-ignore

### Guides
- [Customization](./guides/customization.md) — Colors, animations, dark mode, theming
- [Working with Lists](./guides/lists.md) — Grids, tables, dynamic lists
- [Suspense Integration](./guides/suspense.md) — React Suspense, RSC, streaming
- [Data Fetching](./guides/data-fetching.md) — TanStack Query, SWR, fetch
- [Accessibility](./guides/accessibility.md) — ARIA, reduced motion, screen readers
- [Troubleshooting](./guides/troubleshooting.md) — Common issues and solutions

### Advanced
- [How It Works](./advanced/how-it-works.md) — CSS-first architecture explained
- [Performance](./advanced/performance.md) — Zero runtime cost, bundle size
- [Browser Support](./advanced/browser-support.md) — Compatibility matrix
- [Comparison](./advanced/comparison.md) — vs Boneyard, react-loading-skeleton, etc.
- [Contributing](../CONTRIBUTING.md) — How to contribute to Ghostly

---

## The Ghostly Philosophy

**Your library adapts to the developer's code. Not the other way around.**

Most skeleton libraries require you to rewrite components, run CLI tools, maintain generated files, or learn new component APIs. Ghostly doesn't.

You wrap your existing component with `<Ghostly loading={true}>`. That's it. Your component IS the skeleton — Ghostly uses pure CSS to transform your real layout into animated placeholder blocks.

```tsx
// Before: your component (unchanged)
function ProductCard({ product }: { product?: Product }) {
  return (
    <div className="flex gap-4 p-4 border rounded-xl">
      <img src={product?.image} className="h-48 w-32 rounded-lg" />
      <div>
        <h2 className="text-lg font-bold">{product?.title}</h2>
        <p className="text-sm">{product?.price}</p>
      </div>
    </div>
  )
}

// After: wrap it. Done.
<Ghostly loading={!data}>
  <ProductCard product={data} />
</Ghostly>
```

### Design Principles

1. **Zero config** — Install, import CSS, wrap. No CLI, no build step, no config files
2. **Zero code changes** — Your components stay exactly as they are
3. **CSS-first** — All skeleton logic is pure CSS. No JavaScript overhead at runtime
4. **Progressive** — Works with any React setup: CSR, SSR, RSC, Suspense
5. **Accessible** — ARIA attributes, reduced motion support, screen reader friendly
6. **Tiny** — ~2KB CSS + ~3KB React (gzipped). Zero runtime dependencies in core
