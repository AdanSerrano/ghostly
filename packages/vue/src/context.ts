import type { InjectionKey } from 'vue'
import type { GhostlyAnimation, GhostlyRadius, GhostlySpeed } from '@ghostly-ui/core'

export interface GhostlyContext {
  animation: GhostlyAnimation
  radius: GhostlyRadius
  speed: GhostlySpeed
}

export const ghostlyKey: InjectionKey<GhostlyContext> = Symbol('ghostly')

export const DEFAULTS: GhostlyContext = {
  animation: 'shimmer',
  radius: 'sm',
  speed: 'normal',
}
