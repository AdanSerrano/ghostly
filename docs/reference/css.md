# CSS Reference

Complete reference for all CSS custom properties, selectors, and animations provided by Ghostly.

---

## Importing

```css
/* In your global stylesheet */
@import 'ghostly/css';
```

Or in your root component:

```tsx
import 'ghostly/css'
```

---

## Custom Properties

These CSS custom properties control all visual aspects of Ghostly skeletons. Override them to match your design system.

### `--ghostly-color`

The base color of skeleton blocks.

| Theme | Default |
|-------|---------|
| Light | `hsl(220 13% 87%)` — light gray |
| Dark | `hsl(220 13% 18%)` — dark gray |

```css
:root {
  --ghostly-color: hsl(220 13% 87%);
}
```

### `--ghostly-shine`

The highlight color for the shimmer animation gradient.

| Theme | Default |
|-------|---------|
| Light | `hsl(220 13% 94%)` — slightly lighter gray |
| Dark | `hsl(220 13% 25%)` — slightly lighter dark gray |

```css
:root {
  --ghostly-shine: hsl(220 13% 94%);
}
```

### `--ghostly-radius`

Border radius applied to skeleton blocks.

| Default | Controlled by |
|---------|---------------|
| `4px` | `radius` prop on `<Ghostly>` |

```css
:root {
  --ghostly-radius: 4px;
}
```

### `--ghostly-speed`

Duration of the animation cycle.

| Default | Controlled by |
|---------|---------------|
| `1.5s` | `speed` prop on `<Ghostly>` |

```css
:root {
  --ghostly-speed: 1.5s;
}
```

---

## Selectors

### Container

```css
[data-ghostly]                    /* Any loading Ghostly wrapper */
[data-ghostly='shimmer']          /* Shimmer animation active */
[data-ghostly='pulse']            /* Pulse animation active */
[data-ghostly='wave']             /* Wave animation active */
```

### Text elements (become skeleton blocks)

```css
[data-ghostly] :where(
  h1, h2, h3, h4, h5, h6,
  p, span, a, li, td, th, dt, dd,
  label, legend, figcaption, caption, summary,
  blockquote, cite, q, em, strong, small, mark, code, pre,
  button, input, textarea, select, option
)
```

When skeleton is active, these elements get:
- `color: transparent` — hides text content
- `background-color: var(--ghostly-color)` — shows skeleton block
- `border-radius: var(--ghostly-radius)` — rounded corners
- `border-color: transparent` — hides borders
- `box-shadow: none` — removes shadows
- `min-height: 1em` — prevents empty elements from collapsing

### Media elements (become skeleton blocks)

```css
[data-ghostly] :where(img, svg, video, canvas, picture, iframe)
```

These use a different strategy:
- `visibility: hidden` — hides the element
- `::after` pseudo-element — creates the visible skeleton block

This approach preserves the element's dimensions while hiding its content.

### Exclusions

```css
[data-ghostly] [data-ghostly-ignore],
[data-ghostly] [data-ghostly-ignore] *
```

Elements with `data-ghostly-ignore` and all their children are restored to their original styles.

---

## Animations

### Shimmer (`ghostly-shimmer`)

A linear gradient that sweeps from right to left.

```css
@keyframes ghostly-shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
```

Gradient definition:
```css
background: linear-gradient(
  90deg,
  var(--ghostly-color) 0%,
  var(--ghostly-color) 33%,
  var(--ghostly-shine) 50%,
  var(--ghostly-color) 66%,
  var(--ghostly-color) 100%
);
background-size: 300% 100%;
```

### Pulse (`ghostly-pulse`)

Opacity fades between 100% and 40%.

```css
@keyframes ghostly-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```

### Wave

Uses the same `ghostly-pulse` animation, but with staggered `animation-delay` on each direct child:

```css
[data-ghostly='wave'] > :nth-child(1) { animation-delay: 0ms; }
[data-ghostly='wave'] > :nth-child(2) { animation-delay: 100ms; }
[data-ghostly='wave'] > :nth-child(3) { animation-delay: 200ms; }
/* ... up to :nth-child(n+9) at 800ms */
```

---

## Specificity

Ghostly uses `:where()` pseudo-class for most selectors, which has **zero specificity**. This means you can easily override any Ghostly style with a single class selector:

```css
/* This will override Ghostly's styles for paragraphs */
[data-ghostly] p {
  min-width: 50%;
  min-height: 2em;
}
```

The `!important` declarations are only used where absolutely necessary to override component-level inline styles (color, background, border).

---

## Dark Mode

Ghostly detects dark mode through three mechanisms, in order of priority:

### 1. CSS class (Tailwind convention)

```css
.dark {
  --ghostly-color: hsl(220 13% 18%);
  --ghostly-shine: hsl(220 13% 25%);
}
```

### 2. Data attribute (shadcn/ui, Radix convention)

```css
[data-theme='dark'] {
  --ghostly-color: hsl(220 13% 18%);
  --ghostly-shine: hsl(220 13% 25%);
}
```

### 3. System preference (OS-level)

```css
@media (prefers-color-scheme: dark) {
  :root:not(.light):not([data-theme='light']) {
    --ghostly-color: hsl(220 13% 18%);
    --ghostly-shine: hsl(220 13% 25%);
  }
}
```

The `:not(.light):not([data-theme='light'])` ensures that if you explicitly set light mode, the system preference doesn't override it.

---

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  [data-ghostly] *,
  [data-ghostly] *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

When the user has `prefers-reduced-motion: reduce` enabled, all animations are disabled. Skeletons render as static colored blocks.

---

## Minimum Dimensions

Ghostly sets `min-height` and `min-width` on text elements to prevent them from collapsing when they have no text content:

| Element | `min-height` | `min-width` |
|---------|-------------|-------------|
| `h1` | `1.75em` | `40%` |
| `h2` | `1.5em` | `50%` |
| `h3` | `1.3em` | `55%` |
| `h4`, `h5`, `h6` | `1.15em` | `45%` |
| `p` | `3em` | `80%` |
| `span`, `a`, `li`, etc. | `1em` | `2rem` |
| `input`, `textarea`, `select` | `2.5rem` | `8rem` |
| `button` | `2.25rem` | `5rem` |
| `img` (no explicit size) | `12rem` | `100%` |
| `svg` | `1.5rem` | `1.5rem` |

These are set with `:where()` selectors (zero specificity) so they're easy to override.
