import { computed, inject } from 'vue'
import { RADIUS_MAP, SPEED_MAP, type GhostlyAnimation, type GhostlyRadius, type GhostlySpeed } from '@ghostly-ui/core'
import { ghostlyKey, DEFAULTS } from './context'

interface UseGhostlyReturn {
  animation: GhostlyAnimation
  radius: GhostlyRadius
  speed: GhostlySpeed
  getGhostlyProps: () => Record<string, unknown>
}

/**
 * Read the nearest GhostlyProvider config and get spreadable props.
 *
 * @example
 * ```vue
 * <script setup>
 * const { getGhostlyProps } = useGhostly()
 * </script>
 * <template>
 *   <div v-bind="getGhostlyProps()">Custom skeleton</div>
 * </template>
 * ```
 */
export function useGhostly(): UseGhostlyReturn {
  const ctx = inject(ghostlyKey, DEFAULTS)

  const getGhostlyProps = () => ({
    'data-ghostly': ctx.animation,
    'aria-busy': true,
    'aria-live': 'polite' as const,
    style: {
      '--ghostly-radius': RADIUS_MAP[ctx.radius],
      '--ghostly-speed': SPEED_MAP[ctx.speed],
    },
  })

  return {
    animation: computed(() => ctx.animation).value,
    radius: computed(() => ctx.radius).value,
    speed: computed(() => ctx.speed).value,
    getGhostlyProps,
  }
}
