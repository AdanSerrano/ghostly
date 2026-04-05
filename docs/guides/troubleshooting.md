# Troubleshooting

Common issues and their solutions when using Ghostly.

---

## Skeleton doesn't appear

### CSS not imported

**Symptom:** `data-ghostly` attribute is set on the DOM, but no visual skeleton effect.

**Fix:** Import the Ghostly CSS in your global stylesheet or root layout:

```css
/* globals.css */
@import '@ghostly-ui/core/css';
```

Or in your root component:
```tsx
import '@ghostly-ui/core/css'
```

### CSS import order

**Symptom:** Skeleton colors look wrong or styles are overridden.

**Fix:** Import Ghostly CSS before your component styles but after your CSS reset:

```css
@import 'tailwindcss';       /* 1. Framework */
@import '@ghostly-ui/core/css';        /* 2. Ghostly */
/* Your custom styles below */ /* 3. Your overrides */
```

---

## Elements collapse to zero height

### Empty content without min-height

**Symptom:** Text elements have no height when data is undefined.

**Cause:** The element contains an empty string `""` or `undefined`, and your CSS overrides Ghostly's `min-height`.

**Fix 1:** Ensure Ghostly's min-height isn't being overridden:

```css
/* Check if you have this kind of rule overriding min-height */
p { min-height: 0; }  /* This would break Ghostly */
```

**Fix 2:** Your component can render invisible whitespace:

```tsx
<p>{data?.description ?? '\u00A0'}</p>  {/* Non-breaking space */}
```

**Fix 3:** Add explicit min-height in your CSS:

```css
[data-ghostly] p { min-height: 3em; }
```

---

## Images show broken icon instead of skeleton

### Empty `src` attribute

**Symptom:** Browser shows broken image icon instead of a skeleton block.

**Cause:** `src=""` causes the browser to try loading the current page as an image.

**Fix:** Conditionally render the image or use `undefined`:

```tsx
// Good: conditional render
{product?.image ? (
  <img src={product.image} alt={product.title} className="h-48 w-full" />
) : (
  <div className="h-48 w-full" />  {/* Placeholder div */}
)}

// Good: undefined src (React won't render the attribute)
<img src={product?.image ?? undefined} className="h-48 w-full" />

// Bad: empty string
<img src={product?.image ?? ''} className="h-48 w-full" />
```

---

## Component crashes when data is undefined

### Missing optional chaining

**Symptom:** `TypeError: Cannot read properties of undefined`

**Cause:** Your component accesses properties without null checks.

**Fix:** Use optional chaining throughout your component:

```tsx
// Before (crashes)
function Card({ data }) {
  return <h2>{data.title}</h2>
}

// After (safe)
function Card({ data }: { data?: Data }) {
  return <h2>{data?.title ?? ''}</h2>
}
```

---

## Skeleton visible through transparent backgrounds

### Components with no background

**Symptom:** Skeleton blocks show through components that normally have transparent backgrounds.

**Cause:** Ghostly sets `background-color` on text elements, but if the parent container is transparent, surrounding elements might show through.

**Fix:** Add a background to your container:

```tsx
<Ghostly loading={isLoading}>
  <div className="bg-white rounded-xl p-4">  {/* Add bg-white */}
    <h2>{data?.title}</h2>
  </div>
</Ghostly>
```

---

## Animation not showing

### `prefers-reduced-motion` is enabled

**Symptom:** Skeleton blocks appear but are static (no animation).

**Cause:** Ghostly respects `prefers-reduced-motion: reduce`. This is intentional.

**Check:** Open browser DevTools → Rendering → check "Emulate CSS media feature prefers-reduced-motion".

If you want to force animations (not recommended for accessibility):

```css
/* Override reduced motion (NOT recommended) */
@media (prefers-reduced-motion: reduce) {
  [data-ghostly='shimmer'] * {
    animation: ghostly-shimmer var(--ghostly-speed) ease-in-out infinite !important;
  }
}
```

### `animation="none"` is set

**Symptom:** Static blocks.

**Check:** Verify you're not passing `animation="none"` or that `<GhostlyProvider>` doesn't set it.

---

## GhostlyList shows empty content

### Template component not provided

**Symptom:** `<GhostlyList>` shows nothing during loading.

**Cause:** When `loading={true}` and `children` is an empty array with no `item` prop, there's no template to clone.

**Fix:** Always provide the `item` prop:

```tsx
<GhostlyList
  loading={isLoading}
  count={6}
  item={<ProductCard />}  {/* Always provide this */}
  className="grid grid-cols-3 gap-4"
>
  {products.map(p => <ProductCard key={p.id} product={p} />)}
</GhostlyList>
```

---

## Skeleton persists after data loads

### `loading` prop not updating

**Symptom:** Skeleton never goes away.

**Cause:** The `loading` prop remains `true`.

**Debug:** Check your data fetching hook:

```tsx
const { data, isLoading } = useQuery(...)
console.log('isLoading:', isLoading, 'data:', data)

<Ghostly loading={isLoading}>
  <Component data={data} />
</Ghostly>
```

---

## Dark mode colors don't match

### Custom theme system

**Symptom:** Ghostly uses light skeleton colors in dark mode (or vice versa).

**Cause:** Your app uses a custom dark mode system that Ghostly doesn't detect.

**Fix:** Override the CSS custom properties for your theme system:

```css
/* If your app uses a custom class */
.my-dark-mode {
  --ghostly-color: hsl(220 13% 18%);
  --ghostly-shine: hsl(220 13% 25%);
}

/* If your app uses a custom attribute */
[data-mode='dark'] {
  --ghostly-color: hsl(220 13% 18%);
  --ghostly-shine: hsl(220 13% 25%);
}
```

---

## Performance issues

### Too many skeleton elements

**Symptom:** Page feels slow when many skeletons are rendered.

**Cause:** CSS animations on hundreds of elements can be heavy.

**Fix:**

1. Reduce `count` in `<GhostlyList>` (show fewer skeleton items)
2. Use `animation="pulse"` instead of `animation="shimmer"` (simpler animation)
3. Use `animation="none"` for very large lists
4. Only wrap the visible portion (virtual scrolling)

---

## TypeScript errors

### CSS custom properties in style prop

**Symptom:** TypeScript error when passing CSS variables to `style`.

**Fix:** Cast to `React.CSSProperties`:

```tsx
<Ghostly
  loading={true}
  style={{
    '--ghostly-color': 'hsl(260 30% 88%)',
  } as React.CSSProperties}
>
```
