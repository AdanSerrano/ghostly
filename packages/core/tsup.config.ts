import { defineConfig } from 'tsup'
import { copyFileSync } from 'fs'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: false,
    external: [],
    onSuccess: async () => {
      copyFileSync('src/ghostly.css', 'dist/ghostly.css')
      console.log('CSS copied to dist/')
    },
  },
  {
    entry: ['src/tailwind.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: false,
    minify: false,
    external: ['tailwindcss', 'tailwindcss/plugin'],
  },
])
