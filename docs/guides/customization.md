# Customization Guide

Ghostly is designed to work out of the box, but every aspect is customizable through CSS custom properties and component props.

---

## Quick Reference

| What to customize | How |
|-------------------|-----|
| Colors | CSS custom properties `--ghostly-color`, `--ghostly-shine` |
| Animation | `animation` prop: `shimmer`, `pulse`, `wave`, `none` |
| Border radius | `radius` prop: `none`, `xs`, `sm`, `md`, `lg`, `full` |
| Speed | `speed` prop: `slow`, `normal`, `fast` |
| Dark mode | Automatic (CSS custom properties switch) |
| Per-section colors | `style` prop with CSS variables |
| Global defaults | `<GhostlyProvider>` component |

---

## Theming

### Match your design system colors

The default gray works for most apps, but you can match your brand:

```css
/* Blue-tinted skeleton (for a blue-themed app) */
:root {
  --ghostly-color: hsl(210 40% 88%);
  --ghostly-shine: hsl(210 40% 94%);
}

/* Warm skeleton (for an earthy/warm theme) */
:root {
  --ghostly-color: hsl(30 20% 88%);
  --ghostly-shine: hsl(30 20% 94%);
}

/* Neutral skeleton (pure gray, no hue) */
:root {
  --ghostly-color: hsl(0 0% 88%);
  --ghostly-shine: hsl(0 0% 94%);
}
```

### Dark mode colors

Ghostly auto-detects dark mode. Override the dark colors:

```css
/* Using Tailwind's .dark class */
.dark {
  --ghostly-color: hsl(210 15% 15%);
  --ghostly-shine: hsl(210 15% 22%);
}

/* Using data-theme attribute */
[data-theme='dark'] {
  --ghostly-color: hsl(210 15% 15%);
  --ghostly-shine: hsl(210 15% 22%);
}
```

### Per-section theming

Different sections of your app can have different skeleton colors:

```tsx
// Hero section with a brand-colored skeleton
<Ghostly
  loading={isLoading}
  style={{
    '--ghostly-color': 'hsl(260 60% 90%)',
    '--ghostly-shine': 'hsl(260 60% 95%)',
  } as React.CSSProperties}
>
  <HeroContent data={data} />
</Ghostly>

// Sidebar with a subtle skeleton
<Ghostly
  loading={isLoading}
  style={{
    '--ghostly-color': 'hsl(0 0% 92%)',
    '--ghostly-shine': 'hsl(0 0% 96%)',
  } as React.CSSProperties}
>
  <Sidebar data={data} />
</Ghostly>
```

---

## Animations

### Shimmer (default)

A gradient sweep from right to left. The most professional and widely-used skeleton animation.

```tsx
<Ghostly loading={true} animation="shimmer">
```

Best for: general content, cards, profiles, dashboards.

### Pulse

Opacity fades between 100% and 40%. Subtle and lightweight.

```tsx
<Ghostly loading={true} animation="pulse">
```

Best for: minimal UIs, text-heavy layouts, mobile interfaces.

### Wave

Children animate sequentially with staggered delays, creating a cascading wave effect.

```tsx
<Ghostly loading={true} animation="wave">
```

Best for: lists, timelines, sequential content. Works best when direct children are the items (not deeply nested).

### None

Static skeleton blocks with no animation. Useful for:
- Print stylesheets
- Users with `prefers-reduced-motion`
- Very fast loading states where animation would flash

```tsx
<Ghostly loading={true} animation="none">
```

### Custom animation speed

```tsx
<Ghostly loading={true} speed="fast">    {/* 0.8s */}
<Ghostly loading={true} speed="normal">  {/* 1.5s (default) */}
<Ghostly loading={true} speed="slow">    {/* 2.0s */}
```

Or override with CSS directly:

```css
:root {
  --ghostly-speed: 1s; /* Custom duration */
}
```

---

## Border Radius

Control how rounded the skeleton blocks appear:

```tsx
<Ghostly loading={true} radius="none">  {/* 0px — sharp corners */}
<Ghostly loading={true} radius="xs">    {/* 2px */}
<Ghostly loading={true} radius="sm">    {/* 4px (default) */}
<Ghostly loading={true} radius="md">    {/* 8px */}
<Ghostly loading={true} radius="lg">    {/* 12px */}
<Ghostly loading={true} radius="full">  {/* 9999px — pill shape */}
```

---

## Overriding Element Styles

Ghostly uses `:where()` selectors with zero specificity. A single class selector will override:

```css
/* Make all skeleton headings thinner */
[data-ghostly] h1,
[data-ghostly] h2,
[data-ghostly] h3 {
  min-width: 30%;
}

/* Make paragraphs show 2 lines instead of 3 */
[data-ghostly] p {
  min-height: 2em;
}

/* Skeleton images with fixed aspect ratio */
[data-ghostly] img {
  aspect-ratio: 16 / 9;
  min-height: auto;
}

/* Round all skeleton blocks in a specific section */
.avatar-section [data-ghostly] * {
  --ghostly-radius: 9999px;
}
```

---

## Global Defaults with GhostlyProvider

Set defaults once for your entire app:

```tsx
// app/layout.tsx
import { GhostlyProvider } from '@ghostly/react'
import 'ghostly/css'

export default function Layout({ children }) {
  return (
    <GhostlyProvider animation="shimmer" radius="md" speed="normal">
      {children}
    </GhostlyProvider>
  )
}
```

Individual `<Ghostly>` instances can still override:

```tsx
// This uses pulse even though the provider says shimmer
<Ghostly loading={true} animation="pulse">
  <Card />
</Ghostly>
```
