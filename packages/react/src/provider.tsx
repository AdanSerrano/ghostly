import type { ReactNode } from 'react'
import type { GhostlyConfig } from 'ghostly'
import { GhostlyContext } from './context'

interface GhostlyProviderProps extends GhostlyConfig {
  children: ReactNode
}

/**
 * Set default Ghostly config for all descendants.
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
  animation = 'shimmer',
  radius = 'sm',
  speed = 'normal',
}: GhostlyProviderProps) {
  return (
    <GhostlyContext value={{ loading: false, animation, radius, speed }}>
      {children}
    </GhostlyContext>
  )
}
