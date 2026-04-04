# Comparison with Alternatives

How Ghostly compares to other skeleton loading libraries.

---

## Feature Matrix

| Feature | Ghostly | Boneyard | react-loading-skeleton | react-content-loader |
|---------|---------|----------|----------------------|---------------------|
| Zero config | Yes | No (CLI) | Partial | No |
| Code changes needed | None | Wrap + fixture | Replace elements | SVG definitions |
| Build step | None | Playwright | None | None |
| Generated files | None | .bones.json | None | None |
| CSS Grid support | Yes | No | N/A | N/A |
| Flexbox support | Yes | Yes | N/A | N/A |
| Any layout | Yes | Flex/Block only | N/A | Manual |
| Dark mode | Auto | Heuristic | Manual | Manual |
| Animations | 3 | 1 (pulse) | 2 | 1 |
| Accessibility | Built-in | Partial | Partial | Partial |
| Framework | React (core: any) | React | React | React |
| Bundle (gzip) | ~3KB | ~16KB | ~4KB | ~6KB |
| Runtime JS | None | Layout engine | Style injection | SVG rendering |
| Maintenance | Zero | Regenerate files | Per-component | Per-component |

---

## Detailed Comparisons

### vs Boneyard

**Boneyard** captures your real DOM layout using Playwright and generates pixel-perfect skeleton coordinates.

| Aspect | Ghostly | Boneyard |
|--------|---------|----------|
| Setup | `npm install` + CSS import | CLI + Playwright + dev server |
| Accuracy | 95% (CSS-based) | 99% (pixel-perfect) |
| Maintenance | Zero | Regenerate on layout change |
| Build time | None | Seconds per component |
| Mock data | Not needed | Required (fixture prop) |
| CSS Grid | Works | Not supported |
| Responsive | Automatic | 3 fixed breakpoints |

**Choose Ghostly if:** You want zero maintenance and fast setup.
**Choose Boneyard if:** You need pixel-perfect skeletons and don't mind the build step.

### vs react-loading-skeleton

**react-loading-skeleton** provides a `<Skeleton>` component that you place where content will appear.

```tsx
// react-loading-skeleton approach
function Card({ data }) {
  return (
    <div>
      {data ? <h2>{data.title}</h2> : <Skeleton height={28} width={200} />}
      {data ? <p>{data.desc}</p> : <Skeleton count={3} />}
    </div>
  )
}

// Ghostly approach
function Card({ data }) {
  return (
    <div>
      <h2>{data?.title ?? ''}</h2>
      <p>{data?.desc ?? ''}</p>
    </div>
  )
}
// Usage: <Ghostly loading={!data}><Card data={data} /></Ghostly>
```

| Aspect | Ghostly | react-loading-skeleton |
|--------|---------|----------------------|
| Code changes | None | Conditional rendering per element |
| Duplication | None | Skeleton + real content in same component |
| Layout accuracy | Same as real (CSS-based) | Manual (you set width/height) |
| Theming | CSS custom properties | Theme provider |
| Animations | 3 (CSS) | 2 (JS-injected) |

**Choose Ghostly if:** You want zero code changes and no duplication.
**Choose react-loading-skeleton if:** You want fine-grained control over each skeleton element.

### vs react-content-loader

**react-content-loader** uses SVG to render skeleton placeholders.

```tsx
// react-content-loader approach
function CardSkeleton() {
  return (
    <ContentLoader viewBox="0 0 400 160">
      <rect x="0" y="0" rx="5" ry="5" width="400" height="80" />
      <rect x="0" y="100" rx="3" ry="3" width="250" height="16" />
      <rect x="0" y="130" rx="3" ry="3" width="180" height="16" />
    </ContentLoader>
  )
}

// Ghostly approach: no separate skeleton component needed
```

| Aspect | Ghostly | react-content-loader |
|--------|---------|---------------------|
| Skeleton definition | Automatic (CSS) | Manual SVG coordinates |
| Responsive | Automatic | Manual viewBox |
| Design tool | None needed | Has a design tool website |
| Accuracy | Layout-based | Pixel-based |
| Custom shapes | HTML elements only | Any SVG shape |

**Choose Ghostly if:** You want automatic skeletons without manual SVG.
**Choose react-content-loader if:** You need custom artistic skeleton shapes.

---

## Migration Guides

### From react-loading-skeleton

1. Remove `<Skeleton>` components from your JSX
2. Ensure your component handles undefined data (optional chaining)
3. Wrap with `<Ghostly loading={isLoading}>`
4. Import `ghostly/css`
5. Remove `react-loading-skeleton` package

### From react-content-loader

1. Remove `<ContentLoader>` SVG components
2. Ensure your real component has proper HTML structure
3. Wrap with `<Ghostly loading={isLoading}>`
4. Import `ghostly/css`
5. Remove `react-content-loader` package

### From manual skeleton components

1. Remove your `*Skeleton` component files
2. Ensure main components handle undefined data
3. Replace `{isLoading ? <MySkeleton /> : <MyComponent />}` with `<Ghostly loading={isLoading}><MyComponent /></Ghostly>`
4. Import `ghostly/css`
