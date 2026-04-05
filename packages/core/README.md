# ghostly

CSS-first skeleton loading engine. Zero dependencies. Framework-agnostic.

> Your component IS the skeleton. Ghostly uses CSS to hide text and images, replacing them with animated placeholders -- preserving the exact same layout.

## Install

```bash
npm install ghostly
```

## Quick Start

Import the CSS and add `data-ghostly` to any container:

```css
@import 'ghostly/css';
```

```html
<div data-ghostly="shimmer">
  <h2>This becomes a skeleton</h2>
  <p>So does this</p>
  <img src="photo.jpg" />
</div>
```

Remove the attribute to show real content. That's it.

## Features

- **3 animations** -- shimmer, pulse, wave (all pure CSS)
- **Dark mode** -- auto-detects via `.dark`, `data-theme="dark"`, or `prefers-color-scheme`
- **Accessible** -- `prefers-reduced-motion: reduce` disables animations
- **Zero specificity** -- uses `:where()` selectors, easy to override
- **Tiny** -- ~2KB gzipped, zero dependencies

## CSS Custom Properties

```css
:root {
  --ghostly-color: hsl(220 13% 87%);   /* skeleton base color */
  --ghostly-shine: hsl(220 13% 94%);   /* shimmer highlight */
  --ghostly-radius: 4px;                /* border radius */
  --ghostly-speed: 1.5s;                /* animation duration */
  --ghostly-transition: 0.3s;           /* fade-out transition */
}
```

## Data Attributes

| Attribute | Description |
|-----------|-------------|
| `data-ghostly="shimmer\|pulse\|wave"` | Activate skeleton on a container |
| `data-ghostly-ignore` | Exclude element from skeleton effect |
| `data-ghostly-lines="1-8"` | Control skeleton line count for text |
| `data-ghostly-ratio="16/9"` | Set aspect ratio for images |
| `data-ghostly-smooth` | Enable fade-out transition |

## Tailwind CSS Plugin

```js
// tailwind.config.js
import ghostly from 'ghostly/tailwind'

export default {
  plugins: [ghostly],
}
```

Utilities: `ghostly-radius-*`, `ghostly-speed-*`, `ghostly-color-[...]`, `ghostly-shine-[...]`, `ghostly:` variant.

## Framework Adapters

- **[@ghostly/react](https://www.npmjs.com/package/@ghostly/react)** -- React components with `<Ghostly>`, `<GhostlyList>`, `<GhostlySuspense>`

## Documentation

Full docs at [ghostly.adanulissess.com](https://ghostly.adanulissess.com)

## License

MIT
