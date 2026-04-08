import { computed, defineComponent, h, inject, type PropType, type CSSProperties } from 'vue'
import { RADIUS_MAP, SPEED_MAP, validateGhostlyProps, type GhostlyAnimation, type GhostlyRadius, type GhostlySpeed } from '@ghostly-ui/core'
import { ghostlyKey, DEFAULTS } from './context'

export const Ghostly = defineComponent({
  name: 'Ghostly',
  props: {
    loading: { type: Boolean, required: true },
    animation: { type: String as PropType<GhostlyAnimation>, default: undefined },
    radius: { type: String as PropType<GhostlyRadius>, default: undefined },
    speed: { type: String as PropType<GhostlySpeed>, default: undefined },
    color: { type: String, default: undefined },
    shine: { type: String, default: undefined },
    as: { type: String, default: 'div' },
    smooth: { type: Boolean, default: false },
  },
  setup(props, { slots }) {
    const parent = inject(ghostlyKey, DEFAULTS)

    const resolved = computed(() => {
      const animation = props.animation ?? parent.animation
      const radius = props.radius ?? parent.radius
      const speed = props.speed ?? parent.speed
      validateGhostlyProps('Ghostly', { animation, radius, speed })
      return { animation, radius, speed }
    })

    const cssVars = computed((): CSSProperties => {
      if (!props.loading) return {}
      return {
        '--ghostly-radius': RADIUS_MAP[resolved.value.radius],
        '--ghostly-speed': SPEED_MAP[resolved.value.speed],
        ...(props.color ? { '--ghostly-color': props.color } : {}),
        ...(props.shine ? { '--ghostly-shine': props.shine } : {}),
      } as CSSProperties
    })

    return () =>
      h(
        props.as,
        {
          'data-ghostly': props.loading ? resolved.value.animation : undefined,
          'data-ghostly-smooth': props.smooth || undefined,
          'aria-busy': props.loading || undefined,
          'aria-live': 'polite',
          style: cssVars.value,
        },
        slots.default?.(),
      )
  },
})
