import type { ReactElement, ReactNode } from 'react'
import { Suspense } from 'react'
import type { GhostlyConfig } from '@ghostly-ui/core'
import { Ghostly } from './ghostly'

interface GhostlySuspenseProps extends GhostlyConfig {
  /** The component tree that may suspend */
  children: ReactNode
  /** Template element shown as skeleton while suspended */
  fallback: ReactElement
  /** HTML tag for the skeleton wrapper */
  as?: 'div' | 'section' | 'article' | 'main' | 'aside'
  /** CSS class applied to the skeleton wrapper */
  className?: string
  /** Enable smooth fade-out transition when content resolves */
  smooth?: boolean
}

/**
 * Suspense-powered skeleton loader. Automatically shows a skeleton
 * of your fallback component while children are suspended.
 *
 * @example
 * ```tsx
 * <GhostlySuspense fallback={<ProductCard />} animation="shimmer">
 *   <ProductCardWithData id={123} />
 * </GhostlySuspense>
 * ```
 */
export function GhostlySuspense({
  children,
  fallback,
  animation,
  radius,
  speed,
  color,
  shine,
  as,
  className,
  smooth,
}: GhostlySuspenseProps) {
  return (
    <Suspense
      fallback={
        <Ghostly
          loading={true}
          animation={animation}
          radius={radius}
          speed={speed}
          color={color}
          shine={shine}
          as={as}
          className={className}
          smooth={smooth}
        >
          {fallback}
        </Ghostly>
      }
    >
      {children}
    </Suspense>
  )
}
