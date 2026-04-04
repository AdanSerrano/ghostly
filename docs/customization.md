# Customization

## CSS Custom Properties

Ghostly uses CSS custom properties for all visual values. Override them to match your design system.

### Global customization

```css
:root {
  --ghostly-color: hsl(220 13% 87%);   /* Skeleton block color */
  --ghostly-shine: hsl(220 13% 94%);   /* Shimmer highlight */
  --ghostly-radius: 4px;                /* Border radius */
  --ghostly-speed: 1.5s;                /* Animation duration */
}
```

### Dark mode

Ghostly auto-detects dark mode via three methods (in order of priority):

1. `.dark` class on any ancestor (Tailwind convention)
2. `data-theme="dark"` attribute (shadcn/ui convention)
3. `prefers-color-scheme: dark` media query (system preference)

Override dark mode colors:

```css
.dark {
  --ghostly-color: hsl(220 13% 18%);
  --ghostly-shine: hsl(220 13% 25%);
}
```

### Per-instance customization

Use the `style` prop to override CSS variables for a specific instance:

```tsx
<Ghostly
  loading={true}
  style={{
    '--ghostly-color': 'hsl(200 80% 90%)',
    '--ghostly-shine': 'hsl(200 80% 95%)',
  } as React.CSSProperties}
>
  <Card />
</Ghostly>
```

Or use `radius` and `speed` props:

```tsx
<Ghostly loading={true} radius="lg" speed="fast">
  <Card />
</Ghostly>
```

## Animations

### Shimmer (default)

A gradient sweep from left to right. The most common skeleton animation, used by Facebook, LinkedIn, YouTube.

```tsx
<Ghostly loading={true} animation="shimmer">
```

### Pulse

Opacity fades in and out. Simple and subtle.

```tsx
<Ghostly loading={true} animation="pulse">
```

### Wave

Like pulse, but children are staggered (each child starts slightly later), creating a wave effect.

```tsx
<Ghostly loading={true} animation="wave">
```

### None

No animation. Static skeleton blocks. Useful for print or reduced motion contexts.

```tsx
<Ghostly loading={true} animation="none">
```

## Accessibility

### Reduced motion

Ghostly automatically respects `prefers-reduced-motion: reduce`. When active, all animations are disabled — skeletons show as static blocks.

### ARIA attributes

The `<Ghostly>` wrapper automatically sets:

- `aria-busy="true"` when loading
- `aria-live="polite"` for screen reader announcements

### Pointer events

While loading, `pointer-events: none` and `user-select: none` prevent interaction with skeleton content.

## Tailwind CSS Integration

Ghostly works with Tailwind out of the box. The CSS custom properties respect Tailwind's dark mode class (`.dark`), and you can use Tailwind utilities alongside Ghostly:

```tsx
<Ghostly loading={isLoading} className="rounded-2xl shadow-lg">
  <ProductCard product={data} />
</Ghostly>
```

## Overriding element styles

Ghostly uses `:where()` selectors for low specificity. You can override any skeleton style with a single class:

```css
/* Make all skeleton paragraphs shorter */
[data-ghostly] p {
  min-width: 50%;
}

/* Custom skeleton color for a specific section */
.hero-section [data-ghostly] {
  --ghostly-color: hsl(260 30% 88%);
  --ghostly-shine: hsl(260 30% 94%);
}
```
