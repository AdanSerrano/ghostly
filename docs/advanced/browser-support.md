# Browser Support

Ghostly uses modern CSS features. Here's the compatibility matrix.

---

## Required CSS Features

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| CSS Custom Properties | 49+ | 31+ | 9.1+ | 15+ |
| `:where()` selector | 88+ | 78+ | 14+ | 88+ |
| `::after` pseudo-element | 1+ | 1+ | 1+ | 12+ |
| `@keyframes` | 43+ | 16+ | 9+ | 12+ |
| `prefers-color-scheme` | 76+ | 67+ | 12.1+ | 79+ |
| `prefers-reduced-motion` | 74+ | 63+ | 10.1+ | 79+ |
| `inset` shorthand | 87+ | 66+ | 14.1+ | 87+ |

## Minimum Supported Browsers

| Browser | Minimum Version | Release Date |
|---------|----------------|-------------|
| Chrome | 88 | Jan 2021 |
| Firefox | 78 | Jun 2020 |
| Safari | 14 | Sep 2020 |
| Edge | 88 | Jan 2021 |
| iOS Safari | 14 | Sep 2020 |
| Android Chrome | 88 | Jan 2021 |

The limiting factor is the `:where()` selector, which shipped in all major browsers by early 2021.

---

## Not Supported

| Browser | Notes |
|---------|-------|
| Internet Explorer | Not supported (no CSS Custom Properties, no `:where()`) |
| Opera Mini | Limited CSS animation support |
| UC Browser < 15 | No `:where()` support |

---

## Graceful Degradation

On browsers that don't support `:where()`, Ghostly's skeleton styles won't apply, but:
- The page will render normally (no broken layout)
- Loading states will show raw content or empty elements
- All other functionality works

If you need to support older browsers, you can replace `:where()` with direct selectors in a forked CSS file (at the cost of higher specificity).

---

## Testing

We recommend testing Ghostly in:

1. **Chrome** (latest) — Primary development browser
2. **Safari** (latest) — Verify `::after` pseudo-elements on media
3. **Firefox** (latest) — Verify animations
4. **Mobile Safari (iOS)** — Touch interactions + reduced motion
5. **Chrome Android** — Mobile layout + animations
