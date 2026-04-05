# How It Works

A deep dive into Ghostly's CSS-first architecture and why it's different from other skeleton libraries.

---

## The Core Insight

> **Your component IS the skeleton.**

Most skeleton libraries generate a separate skeleton component — either manually or through build-time DOM capture. Ghostly takes a fundamentally different approach: it uses your real component with its real CSS layout and transforms it visually using pure CSS.

```
Traditional approach:
  Component → [build tool] → Skeleton Component → render skeleton OR component

Ghostly approach:
  Component → render component → [CSS attribute] → looks like skeleton OR content
```

---

## The Three Layers

### Layer 1: React Components (coordination)

The React layer is minimal — it only coordinates loading state:

```tsx
function Ghostly({ loading, children, animation }) {
  return (
    <div
      data-ghostly={loading ? animation : undefined}
      aria-busy={loading || undefined}
    >
      {children}
    </div>
  )
}
```

That's essentially the entire React component. It:
1. Sets `data-ghostly` attribute when loading
2. Sets `aria-busy` for accessibility
3. Provides context for nested components
4. Merges CSS custom properties for configuration

**No DOM manipulation. No style calculations. No refs.**

### Layer 2: CSS Engine (the actual work)

All visual transformation happens in CSS. When `data-ghostly` is present:

**Text elements:**
```css
[data-ghostly] :where(h1, h2, p, span, a, button, ...) {
  color: transparent !important;        /* Hide text */
  background-color: var(--ghostly-color) !important;  /* Show block */
  border-radius: var(--ghostly-radius) !important;
  min-height: 1em;                      /* Prevent collapse */
}
```

**Media elements:**
```css
[data-ghostly] :where(img, svg, video, ...) {
  visibility: hidden !important;        /* Hide content */
}
[data-ghostly] :where(img, svg, video, ...)::after {
  content: '';
  position: absolute;
  inset: 0;
  visibility: visible;                  /* Show skeleton block */
  background-color: var(--ghostly-color);
}
```

**Why `::after` for media instead of `background-color`?** Because images render their `src` on top of `background-color`. The only way to visually replace an image with a solid block is to overlay it with a pseudo-element.

### Layer 3: CSS Custom Properties (configuration)

All configurable values are CSS custom properties:

```css
:root {
  --ghostly-color: hsl(220 13% 87%);
  --ghostly-shine: hsl(220 13% 94%);
  --ghostly-radius: 4px;
  --ghostly-speed: 1.5s;
}
```

React components set these via `style` prop when the user passes `radius`, `speed`, etc. But users can also override them directly in CSS — no JavaScript needed.

---

## Why CSS-First?

### Zero runtime cost

Traditional skeleton libraries run JavaScript to:
- Measure DOM elements
- Calculate positions
- Create and position skeleton elements
- Update on resize

Ghostly runs **zero JavaScript** for the visual skeleton. The browser's CSS engine handles everything. This means:
- No `requestAnimationFrame` loops
- No `ResizeObserver`
- No `getBoundingClientRect`
- No layout thrashing

### Automatic responsiveness

Because the skeleton IS the real component with real CSS, it responds to viewport changes automatically. No breakpoint configuration needed.

### No desynchronization

Traditional skeleton libraries generate skeleton layouts that can become stale when the component changes. Ghostly can never desynchronize because it IS the component.

### Tiny bundle size

- `@ghostly-ui/core` (CSS): ~2KB gzipped
- `@ghostly-ui/react`: ~1KB gzipped

Compare with Boneyard (~16KB + Playwright as a dev dependency) or react-loading-skeleton (~4KB + runtime style injection).

---

## CSS Selector Strategy

### Why `:where()`?

Ghostly uses `:where()` for most selectors:

```css
[data-ghostly] :where(h1, h2, h3, p, span, ...) { ... }
```

`:where()` has **zero specificity**, meaning any user CSS with a class selector will override it:

```css
/* Specificity: 0-1-1 (attribute + element) → from :where() it's 0-1-0 */
[data-ghostly] :where(p) { min-height: 3em; }

/* Specificity: 0-1-1 → overrides Ghostly */
[data-ghostly] p { min-height: 2em; }
```

### Why `!important`?

Some properties use `!important`:

```css
color: transparent !important;
background-color: var(--ghostly-color) !important;
```

This is necessary because component-level styles (especially inline styles and CSS-in-JS) often have high specificity. Without `!important`, a Tailwind class like `text-blue-600` would show colored text through the skeleton.

The `!important` is scoped to `[data-ghostly]`, so it only applies during loading.

---

## Limitations

### Content must render

The component must render something for Ghostly to work. If the component returns `null` when data is missing, there's nothing to skeletonize.

### CSS Grid and complex layouts

Ghostly preserves your existing layout. If your layout depends on content dimensions (like CSS Grid's `auto` rows), empty content might cause different sizing than loaded content.

### Inline styles with high specificity

Some CSS-in-JS solutions inject styles with very high specificity that even `!important` can't override. In these rare cases, you may need to use `data-ghostly-ignore` on affected elements.

### Pseudo-elements

If your component already uses `::after` on an element that Ghostly also uses `::after` for (like `<img>`), there may be a conflict. This is rare in practice.
