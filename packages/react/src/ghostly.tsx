import type { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import { useContext, useMemo } from 'react'
import { RADIUS_MAP, SPEED_MAP, type GhostlyAnimation, type GhostlyConfig } from 'ghostly'
import { GhostlyContext } from './context'

interface GhostlyProps extends GhostlyConfig, Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** When true, children appear as skeleton blocks */
  loading: boolean
  children: ReactNode
  /** HTML tag for the wrapper element. Default: 'div' */
  as?: 'div' | 'section' | 'article' | 'main' | 'aside' | 'span'
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
export function Ghostly({
  loading,
  children,
  animation,
  radius,
  speed,
  as: Tag = 'div',
  className,
  style,
  ...rest
}: GhostlyProps) {
  const parent = useContext(GhostlyContext)

  const resolvedAnimation = animation ?? parent.animation ?? 'shimmer'
  const resolvedRadius = radius ?? parent.radius ?? 'sm'
  const resolvedSpeed = speed ?? parent.speed ?? 'normal'

  const cssVars = useMemo(
    (): CSSProperties =>
      loading
        ? {
            '--ghostly-radius': RADIUS_MAP[resolvedRadius],
            '--ghostly-speed': SPEED_MAP[resolvedSpeed],
            ...style,
          } as CSSProperties
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
}
