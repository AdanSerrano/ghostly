import type { CSSProperties } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { RADIUS_MAP, SPEED_MAP, type GhostlyAnimation, type GhostlyRadius, type GhostlySpeed } from 'ghostly'

interface GhostlyContextValue {
  /** Whether the nearest Ghostly ancestor is in loading state */
  loading: boolean
  animation: GhostlyAnimation
  radius: GhostlyRadius
  speed: GhostlySpeed
}

/** Props you can spread onto any element to apply skeleton styles manually */
interface GhostlySpreadProps {
  'data-ghostly'?: string
  'aria-busy'?: boolean
  'aria-live': 'polite'
  style: CSSProperties
}

export const GhostlyContext = createContext<GhostlyContextValue>({
  loading: false,
  animation: 'shimmer',
  radius: 'sm',
  speed: 'normal',
})

GhostlyContext.displayName = 'GhostlyContext'

interface UseGhostlyReturn extends GhostlyContextValue {
  /** Spread these props onto any element to make it a skeleton container */
  getGhostlyProps: () => GhostlySpreadProps
}

/** Read the nearest Ghostly loading state, config, and get spreadable props */
export function useGhostly(): UseGhostlyReturn {
  const ctx = useContext(GhostlyContext)

  const getGhostlyProps = useMemo(
    () => (): GhostlySpreadProps => ({
      'data-ghostly': ctx.loading ? ctx.animation : undefined,
      'aria-busy': ctx.loading || undefined,
      'aria-live': 'polite',
      style: ctx.loading
        ? ({
            '--ghostly-radius': RADIUS_MAP[ctx.radius],
            '--ghostly-speed': SPEED_MAP[ctx.speed],
          } as CSSProperties)
        : {},
    }),
    [ctx.loading, ctx.animation, ctx.radius, ctx.speed],
  )

  return { ...ctx, getGhostlyProps }
}
