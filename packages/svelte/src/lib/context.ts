import type { GhostlyAnimation, GhostlyRadius, GhostlySpeed } from '@ghostly-ui/core'

export interface GhostlyContext {
  animation: GhostlyAnimation
  radius: GhostlyRadius
  speed: GhostlySpeed
}

export const CONTEXT_KEY = 'ghostly'

export const DEFAULTS: GhostlyContext = {
  animation: 'shimmer',
  radius: 'sm',
  speed: 'normal',
}
