# Accessibility

Ghostly is designed with accessibility as a first-class concern. This guide covers what's built-in and best practices.

---

## Built-in Accessibility Features

### ARIA Attributes

Every `<Ghostly>` wrapper automatically sets:

| Attribute | When loading | When loaded | Purpose |
|-----------|-------------|-------------|---------|
| `aria-busy` | `"true"` | removed | Tells assistive tech the region is updating |
| `aria-live` | `"polite"` | `"polite"` | Announces content changes when idle |

```html
<!-- Loading state (automatic) -->
<div data-ghostly="shimmer" aria-busy="true" aria-live="polite">
  ...
</div>

<!-- Loaded state (automatic) -->
<div aria-live="polite">
  ...
</div>
```

### Reduced Motion

When the user has `prefers-reduced-motion: reduce` enabled (in their OS accessibility settings), all Ghostly animations are automatically disabled:

```css
@media (prefers-reduced-motion: reduce) {
  [data-ghostly] *,
  [data-ghostly] *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

Skeletons still appear as static colored blocks — only the animation is removed.

### Pointer Events

During loading, `pointer-events: none` and `user-select: none` prevent users from accidentally interacting with skeleton content. This prevents:

- Clicking on placeholder buttons
- Selecting invisible text
- Tab-focusing into skeleton inputs

---

## Best Practices

### Use semantic HTML in your components

Ghostly relies on HTML tags to identify content:

```tsx
// Good: semantic tags → Ghostly knows what to skeletonize
<article>
  <h2>{title}</h2>
  <p>{description}</p>
  <img src={image} alt={alt} />
</article>

// Less ideal: only divs → Ghostly can't distinguish content from structure
<div>
  <div className="title">{title}</div>
  <div className="desc">{description}</div>
  <div className="img" style={{ backgroundImage: `url(${image})` }} />
</div>
```

### Provide meaningful alt text

Even though images are hidden during loading, keep `alt` attributes for when content loads:

```tsx
<img
  src={product?.image ?? undefined}
  alt={product?.title ?? 'Product image'}  // Always meaningful
  className="h-48 w-full"
/>
```

### Don't disable loading skeletons for accessibility

Skeleton loaders improve the experience for all users by:
- Reducing perceived load time
- Preventing layout shift (CLS)
- Providing visual feedback that content is coming

### Label skeleton regions

For complex pages, add `aria-label` to skeleton regions:

```tsx
<Ghostly loading={isLoading} aria-label="Product details loading">
  <ProductDetail product={data} />
</Ghostly>
```

### Avoid long loading states

If content takes more than 5 seconds to load:
- Consider showing a progress indicator alongside the skeleton
- Add a "Still loading..." text after a timeout
- Provide a retry mechanism

```tsx
function ContentWithTimeout() {
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      <Ghostly loading={isLoading}>
        <Content data={data} />
      </Ghostly>
      {isLoading && showHint && (
        <p className="mt-2 text-sm text-gray-500" role="status">
          Still loading, please wait...
        </p>
      )}
    </div>
  )
}
```

---

## Screen Reader Experience

1. **Page loads** → Screen reader encounters `aria-busy="true"` → announces "region busy"
2. **Content arrives** → `aria-busy` is removed → `aria-live="polite"` triggers announcement of new content
3. **User navigates** → Real content is accessible with proper headings, links, and labels

---

## Testing Accessibility

### Manual testing

1. **Keyboard navigation**: Tab through a loading page — ensure no skeleton elements are focusable
2. **Screen reader**: Use VoiceOver (Mac) or NVDA (Windows) to verify announcements
3. **Reduced motion**: Enable `prefers-reduced-motion` in browser DevTools and verify animations stop
4. **High contrast**: Verify skeleton blocks are visible in high contrast mode

### Automated testing

```tsx
import { render } from '@testing-library/react'
import { Ghostly } from '@ghostly-ui/react'

test('sets aria-busy when loading', () => {
  const { container } = render(
    <Ghostly loading={true}>
      <p>Content</p>
    </Ghostly>
  )

  const wrapper = container.firstElementChild
  expect(wrapper).toHaveAttribute('aria-busy', 'true')
  expect(wrapper).toHaveAttribute('aria-live', 'polite')
})

test('removes aria-busy when loaded', () => {
  const { container } = render(
    <Ghostly loading={false}>
      <p>Content</p>
    </Ghostly>
  )

  const wrapper = container.firstElementChild
  expect(wrapper).not.toHaveAttribute('aria-busy')
})
```
