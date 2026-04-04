import { createContext, useContext } from 'react'
import type { GhostlyAnimation, GhostlyRadius, GhostlySpeed } from 'ghostly'

interface GhostlyContextValue {
  /** Whether the nearest Ghostly ancestor is in loading state */
  loading: boolean
  animation: GhostlyAnimation
  radius: GhostlyRadius
  speed: GhostlySpeed
}

export const GhostlyContext = createContext<GhostlyContextValue>({
  loading: false,
  animation: 'shimmer',
  radius: 'sm',
  speed: 'normal',
})

GhostlyContext.displayName = 'GhostlyContext'

/** Read the nearest Ghostly loading state and config */
export function useGhostly(): GhostlyContextValue {
  return useContext(GhostlyContext)
}
