# HTML Attributes Reference

Ghostly uses HTML data attributes to control skeleton behavior. These attributes are the bridge between the React components and the CSS engine.

---

## `data-ghostly`

**Set by:** `<Ghostly>` component (automatically)
**Applied to:** The wrapper element
**Values:** `shimmer` | `pulse` | `wave`

This is the main activation attribute. When present, all descendant elements matching the CSS selectors become skeleton blocks.

```html
<!-- Active: children are skeletonized -->
<div data-ghostly="shimmer">
  <h2>This text is hidden, background becomes gray</h2>
</div>

<!-- Inactive: normal rendering -->
<div>
  <h2>This text is visible normally</h2>
</div>
```

### Using without React

You can use Ghostly's CSS without the React components by adding this attribute directly:

```html
<!-- Pure HTML/CSS usage -->
<div data-ghostly="shimmer" id="my-content">
  <h1>Page Title</h1>
  <p>Some content that will look like a skeleton</p>
</div>

<script>
  // Toggle skeleton
  fetch('/api/data').then(res => {
    document.getElementById('my-content').removeAttribute('data-ghostly')
  })
</script>
```

---

## `data-ghostly-ignore`

**Set by:** Developer (manually)
**Applied to:** Any element inside a `<Ghostly>` wrapper
**Values:** Boolean attribute (presence is enough)

Excludes an element and **all its children** from the skeleton effect. The element renders normally even when the parent `<Ghostly>` is loading.

```html
<div data-ghostly="shimmer">
  <h2>This is a skeleton block</h2>
  <p>This is a skeleton block</p>

  <!-- This element and everything inside it stays normal -->
  <nav data-ghostly-ignore>
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</div>
```

### Common use cases

```tsx
// Navigation that should always be visible
<Ghostly loading={isLoading}>
  <div className="flex justify-between">
    <div>
      <h1>{data?.title}</h1>
      <p>{data?.description}</p>
    </div>
    <nav data-ghostly-ignore>
      <button>Share</button>
      <button>Save</button>
    </nav>
  </div>
</Ghostly>

// Fixed action bar
<Ghostly loading={isLoading}>
  <ProductDetails product={data} />
  <div data-ghostly-ignore className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
    <button className="btn-primary w-full">Add to Cart — $29.99</button>
  </div>
</Ghostly>

// Logo in a loading header
<Ghostly loading={isLoading}>
  <header className="flex items-center gap-4 p-4">
    <img data-ghostly-ignore src="/logo.svg" className="h-8" />
    <span>{user?.name}</span>
  </header>
</Ghostly>
```

### Behavior details

- Restores `color`, `background-color`, `border-color`, `box-shadow` to inherited values
- Restores `visibility` to visible
- Re-enables `pointer-events` and `user-select`
- Removes `min-height` and `min-width` constraints
- Disables all Ghostly animations
- Applies to the element AND all its descendants (via `[data-ghostly-ignore] *` selector)

---

## `aria-busy`

**Set by:** `<Ghostly>` component (automatically)
**Applied to:** The wrapper element
**Values:** `true` (when loading) | removed (when not loading)

Indicates to assistive technologies that the region is being updated.

```html
<div data-ghostly="shimmer" aria-busy="true" aria-live="polite">
  <!-- Screen readers announce this region is loading -->
</div>
```

---

## `aria-live`

**Set by:** `<Ghostly>` component (automatically)
**Applied to:** The wrapper element
**Values:** `polite`

Tells screen readers to announce changes to this region when the user is idle. Combined with `aria-busy`, this provides a complete accessibility story:

1. When loading starts: `aria-busy="true"` tells the screen reader the region is updating
2. When loading ends: `aria-busy` is removed, `aria-live="polite"` triggers an announcement of the new content
