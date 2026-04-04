import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { forwardRef, useContext, useMemo } from 'react'
import { RADIUS_MAP, SPEED_MAP, type GhostlyConfig } from 'ghostly'
import { GhostlyContext } from './context'

type WrapperTag = 'div' | 'section' | 'article' | 'main' | 'aside' | 'span'

interface GhostlyProps extends GhostlyConfig, Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** When true, children appear as skeleton blocks */
  loading: boolean
  children: ReactNode
  /** HTML tag for the wrapper element. Default: 'div' */
  as?: WrapperTag
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
  { loading, children, animation, radius, speed, as: Tag = 'div', className, style, ...rest },
  ref: Ref<HTMLElement>,
) {
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
            ...style,
          } as CSSProperties)
        : (style ?? {}),
    [loading, resolvedRadius, resolvedSpeed, style],
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
