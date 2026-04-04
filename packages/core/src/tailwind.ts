import plugin from 'tailwindcss/plugin'

/**
 * Tailwind CSS plugin for Ghostly skeleton loaders.
 *
 * Adds utilities for configuring ghostly CSS variables
 * and a `ghostly:` variant for conditional skeleton styles.
 *
 * @example
 * ```js
 * // tailwind.config.js
 * import ghostly from 'ghostly/tailwind'
 * export default { plugins: [ghostly] }
 * ```
 *
 * Usage in templates:
 * ```html
 * <div class="ghostly-radius-lg ghostly-speed-fast">
 *   ...
 * </div>
 * ```
 */
export default plugin(function ghostlyPlugin({ addUtilities, addVariant, matchUtilities }) {
  // Variant: `ghostly:` targets elements inside a ghostly container
  addVariant('ghostly', '[data-ghostly] &')

  // Radius utilities
  addUtilities({
    '.ghostly-radius-none': { '--ghostly-radius': '0px' },
    '.ghostly-radius-xs': { '--ghostly-radius': '2px' },
    '.ghostly-radius-sm': { '--ghostly-radius': '4px' },
    '.ghostly-radius-md': { '--ghostly-radius': '8px' },
    '.ghostly-radius-lg': { '--ghostly-radius': '12px' },
    '.ghostly-radius-full': { '--ghostly-radius': '9999px' },
  })

  // Speed utilities
  addUtilities({
    '.ghostly-speed-slow': { '--ghostly-speed': '2s' },
    '.ghostly-speed-normal': { '--ghostly-speed': '1.5s' },
    '.ghostly-speed-fast': { '--ghostly-speed': '0.8s' },
  })

  // Color utilities (arbitrary value via matchUtilities)
  matchUtilities(
    { 'ghostly-color': (value: string) => ({ '--ghostly-color': value }) },
    { values: {}, type: ['color'] },
  )

  matchUtilities(
    { 'ghostly-shine': (value: string) => ({ '--ghostly-shine': value }) },
    { values: {}, type: ['color'] },
  )
})
