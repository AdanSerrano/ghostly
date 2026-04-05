# Performance

Ghostly is designed for zero runtime overhead. Here's the performance profile.

---

## Bundle Size

| Package | Raw | Gzipped | Brotli |
|---------|-----|---------|--------|
| `@ghostly-ui/core` (CSS) | ~4KB | ~2KB | ~1.5KB |
| `@ghostly-ui/react` | ~3KB | ~1KB | ~0.8KB |
| **Total** | **~7KB** | **~3KB** | **~2.3KB** |

### Comparison

| Library | Gzipped | Runtime JS | Build step |
|---------|---------|-----------|------------|
| **Ghostly** | **~3KB** | **None** | **None** |
| react-loading-skeleton | ~4KB | Style injection | None |
| react-content-loader | ~6KB | SVG rendering | None |
| Boneyard | ~16KB | Layout engine | Playwright CLI |

---

## Runtime Performance

### CSS animations vs JavaScript animations

Ghostly uses CSS `@keyframes` animations, which are:

- **GPU-accelerated**: The browser composites the animation on the GPU
- **Off main thread**: Doesn't block JavaScript execution
- **Battery efficient**: Browser can throttle when tab is inactive

### No layout thrashing

Traditional skeleton libraries often call `getBoundingClientRect()` to measure elements, which forces the browser to recalculate layout. Ghostly never reads layout properties — it only sets CSS attributes.

### Memory

Ghostly creates no additional DOM nodes (except `::after` pseudo-elements for media). The skeleton is the same DOM tree as the real content.

---

## Best Practices

### Limit skeleton count

For large lists, don't render 100 skeleton items. Show a reasonable number:

```tsx
// Good: show 6-12 items
<GhostlyList count={8} ...>

// Bad: matches the expected final count
<GhostlyList count={200} ...>
```

### Use `pulse` for large skeleton areas

The `shimmer` animation creates a gradient that scales with the element size. For very large areas, `pulse` is more efficient:

```tsx
// Large chart area → use pulse
<Ghostly loading={isLoading} animation="pulse">
  <LargeChart data={data} />
</Ghostly>
```

### Avoid re-renders during loading

Since Ghostly is CSS-driven, changing the `loading` prop is the only thing that triggers a re-render. Don't pass changing data while loading:

```tsx
// Good: stable reference during loading
<Ghostly loading={isLoading}>
  <Card data={isLoading ? undefined : data} />
</Ghostly>

// Wasteful: data changes trigger re-renders even while skeleton is shown
<Ghostly loading={isLoading}>
  <Card data={data} />  {/* data might change from null → partial → full */}
</Ghostly>
```

---

## Core Web Vitals Impact

### Cumulative Layout Shift (CLS)

Ghostly **reduces CLS** because:
- Skeleton preserves the same layout as final content
- `min-height` prevents elements from collapsing
- No DOM structure changes between loading and loaded states

### Largest Contentful Paint (LCP)

Ghostly has **no impact on LCP**. The CSS file is small (~2KB gzipped) and doesn't block rendering. Skeletons appear immediately while the actual LCP element loads.

### Interaction to Next Paint (INP)

Ghostly has **no impact on INP** because:
- `pointer-events: none` prevents interaction during loading
- No JavaScript event handlers run during skeleton state
- CSS animations don't block the main thread
