/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Tailwind CSS v3 plugin for Ghostly skeleton loaders.
 *
 * Adds utilities for configuring ghostly CSS variables
 * and a `ghostly:` variant for conditional skeleton styles.
 *
 * @example
 * ```js
 * // tailwind.config.js
 * import ghostly from '@ghostly-ui/core/tailwind'
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

interface PluginAPI {
  addUtilities: (utilities: Record<string, Record<string, string>>) => void
  addVariant: (name: string, definition: string) => void
  matchUtilities: (
    utilities: Record<string, (value: string) => Record<string, string>>,
    options: { values: Record<string, string>; type: string[] },
  ) => void
}

// Dynamic import to support both Tailwind v3 (has plugin) and v4 (dropped JS plugin API)
let pluginFn: ((cb: (api: PluginAPI) => void) => any) | undefined
try {
  pluginFn = require('tailwindcss/plugin')
  if (pluginFn && typeof pluginFn === 'object' && 'default' in pluginFn) {
    pluginFn = (pluginFn as any).default
  }
} catch {
  // Tailwind v4 or not installed — plugin API not available
}

function createPlugin(api: PluginAPI): void {
  api.addVariant('ghostly', '[data-ghostly] &')

  api.addUtilities({
    '.ghostly-radius-none': { '--ghostly-radius': '0px' },
    '.ghostly-radius-xs': { '--ghostly-radius': '2px' },
    '.ghostly-radius-sm': { '--ghostly-radius': '4px' },
    '.ghostly-radius-md': { '--ghostly-radius': '8px' },
    '.ghostly-radius-lg': { '--ghostly-radius': '12px' },
    '.ghostly-radius-full': { '--ghostly-radius': '9999px' },
  })

  api.addUtilities({
    '.ghostly-speed-slow': { '--ghostly-speed': '2s' },
    '.ghostly-speed-normal': { '--ghostly-speed': '1.5s' },
    '.ghostly-speed-fast': { '--ghostly-speed': '0.8s' },
  })

  api.matchUtilities(
    { 'ghostly-color': (value: string) => ({ '--ghostly-color': value }) },
    { values: {}, type: ['color'] },
  )

  api.matchUtilities(
    { 'ghostly-shine': (value: string) => ({ '--ghostly-shine': value }) },
    { values: {}, type: ['color'] },
  )
}

const ghostlyPlugin: any = pluginFn ? pluginFn(createPlugin) : { handler: createPlugin }

export default ghostlyPlugin
