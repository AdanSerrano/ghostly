import { createContext, useContext } from 'react'
import type { GhostlyConfig } from 'ghostly'

interface GhostlyContextValue extends GhostlyConfig {
  /** Whether the nearest Ghostly ancestor is in loading state */
  loading: boolean
}

export const GhostlyContext = createContext<GhostlyContextValue>({
  loading: false,
  animation: 'shimmer',
  radius: 'sm',
  speed: 'normal',
})

/** Read the nearest Ghostly loading state and config */
export function useGhostly(): GhostlyContextValue {
  return useContext(GhostlyContext)
}
