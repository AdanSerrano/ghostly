import type { ReactNode } from 'react'
import { useContext } from 'react'
import type { GhostlyConfig } from '@ghostly-ui/core'
import { GhostlyContext } from './context'

interface GhostlyProviderProps extends GhostlyConfig {
  children: ReactNode
}

/**
 * Set default Ghostly config for all descendants.
 * Nested providers inherit values from their parent — only override what you specify.
 *
 * @example
 * ```tsx
 * <GhostlyProvider animation="shimmer" radius="md">
 *   <App />
 * </GhostlyProvider>
 * ```
 */
export function GhostlyProvider({
  children,
  animation,
  radius,
  speed,
}: GhostlyProviderProps) {
  const parent = useContext(GhostlyContext)

  return (
    <GhostlyContext
      value={{
        loading: false,
        animation: animation ?? parent.animation,
        radius: radius ?? parent.radius,
        speed: speed ?? parent.speed,
      }}
    >
      {children}
    </GhostlyContext>
  )
}
