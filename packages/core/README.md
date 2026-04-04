# ghostly

CSS-first skeleton loading engine. Zero dependencies. Framework-agnostic.

This is the core package of [Ghostly](https://github.com/AdanSerrano/ghostly). It contains:

- `ghostly.css` — All skeleton styles, animations, dark mode, and accessibility
- TypeScript types shared across framework adapters

## Install

```bash
npm install ghostly
```

## Usage

Import the CSS in your app:

```css
@import 'ghostly/css';
```

Then add `data-ghostly="shimmer|pulse|wave"` to any container element:

```html
<div data-ghostly="shimmer">
  <h2>This becomes a skeleton</h2>
  <p>So does this</p>
  <img src="photo.jpg" />
</div>
```

Remove the attribute to show real content.

## CSS Custom Properties

```css
:root {
  --ghostly-color: hsl(220 13% 87%);
  --ghostly-shine: hsl(220 13% 94%);
  --ghostly-radius: 4px;
  --ghostly-speed: 1.5s;
}
```

## Framework Adapters

- [@ghostly/react](https://www.npmjs.com/package/@ghostly/react) — React components

## License

MIT
