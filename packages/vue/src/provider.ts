import { defineComponent, inject, provide, type PropType } from 'vue'
import type { GhostlyAnimation, GhostlyRadius, GhostlySpeed } from '@ghostly-ui/core'
import { ghostlyKey, DEFAULTS } from './context'

export const GhostlyProvider = defineComponent({
  name: 'GhostlyProvider',
  props: {
    animation: { type: String as PropType<GhostlyAnimation>, default: undefined },
    radius: { type: String as PropType<GhostlyRadius>, default: undefined },
    speed: { type: String as PropType<GhostlySpeed>, default: undefined },
  },
  setup(props, { slots }) {
    const parent = inject(ghostlyKey, DEFAULTS)

    provide(ghostlyKey, {
      animation: props.animation ?? parent.animation,
      radius: props.radius ?? parent.radius,
      speed: props.speed ?? parent.speed,
    })

    return () => slots.default?.()
  },
})
