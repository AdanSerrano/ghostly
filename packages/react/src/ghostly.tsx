import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { forwardRef, useContext, useEffect, useMemo, useRef } from 'react'
import { RADIUS_MAP, SPEED_MAP, validateGhostlyProps, type GhostlyConfig } from '@ghostly-ui/core'
import { GhostlyContext } from './context'

type WrapperTag = 'div' | 'section' | 'article' | 'main' | 'aside' | 'span' | 'ul' | 'ol'

interface GhostlyProps extends GhostlyConfig, Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** When true, children appear as skeleton blocks */
  loading: boolean
  children: ReactNode
  /** HTML tag for the wrapper element. Default: 'div' */
  as?: WrapperTag
  /** Enable smooth fade-out transition when loading ends */
  smooth?: boolean
}

/**
 * Wrap any component to show a skeleton while loading.
 *
 * @example
 * ```tsx
 * <Ghostly loading={isLoading}>
 *   <ProductCard product={data} />
 * </Ghostly>
 * ```
 */
export const Ghostly = forwardRef<HTMLElement, GhostlyProps>(function Ghostly(
  { loading, children, animation, radius, speed, color, shine, as: Tag = 'div', smooth, className, style, ...rest },
  ref: Ref<HTMLElement>,
) {
  validateGhostlyProps('Ghostly', { animation, radius, speed })

  const cssChecked = useRef(false)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || cssChecked.current) return
    cssChecked.current = true
    try {
      let found = false
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const rules = document.styleSheets[i].cssRules
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].cssText.includes('--ghostly-color')) { found = true; break }
          }
        } catch { /* cross-origin sheets throw */ }
        if (found) break
      }
      if (!found) {
        console.warn(
          '[Ghostly] CSS not detected. Did you forget to import it?\n' +
          "Add to your global CSS: @import '@ghostly-ui/core/css';\n" +
          'Or in JS: import "@ghostly-ui/core/css";',
        )
      }
    } catch { /* SSR or no document */ }
  }, [])

  const parent = useContext(GhostlyContext)

  const resolvedAnimation = animation ?? parent.animation
  const resolvedRadius = radius ?? parent.radius
  const resolvedSpeed = speed ?? parent.speed

  const cssVars = useMemo(
    (): CSSProperties =>
      loading
        ? ({
            '--ghostly-radius': RADIUS_MAP[resolvedRadius],
            '--ghostly-speed': SPEED_MAP[resolvedSpeed],
            ...(color ? { '--ghostly-color': color } : {}),
            ...(shine ? { '--ghostly-shine': shine } : {}),
            ...style,
          } as CSSProperties)
        : (style ?? {}),
    [loading, resolvedRadius, resolvedSpeed, color, shine, style],
  )

  const ctx = useMemo(
    () => ({
      loading,
      animation: resolvedAnimation,
      radius: resolvedRadius,
      speed: resolvedSpeed,
    }),
    [loading, resolvedAnimation, resolvedRadius, resolvedSpeed],
  )

  return (
    <GhostlyContext value={ctx}>
      <Tag
        ref={ref as Ref<never>}
        data-ghostly={loading ? resolvedAnimation : undefined}
        data-ghostly-smooth={smooth || undefined}
        aria-busy={loading || undefined}
        aria-live="polite"
        className={className}
        style={cssVars}
        {...rest}
      >
        {children}
      </Tag>
    </GhostlyContext>
  )
})
