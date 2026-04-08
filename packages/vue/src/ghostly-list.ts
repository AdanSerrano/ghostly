import { computed, defineComponent, h, type PropType, type VNode } from 'vue'
import { validateGhostlyProps, type GhostlyAnimation, type GhostlyRadius, type GhostlySpeed } from '@ghostly-ui/core'
import { Ghostly } from './ghostly'

export const GhostlyList = defineComponent({
  name: 'GhostlyList',
  props: {
    loading: { type: Boolean, required: true },
    count: { type: Number, required: true },
    animation: { type: String as PropType<GhostlyAnimation>, default: undefined },
    radius: { type: String as PropType<GhostlyRadius>, default: undefined },
    speed: { type: String as PropType<GhostlySpeed>, default: undefined },
    color: { type: String, default: undefined },
    shine: { type: String, default: undefined },
    as: { type: String, default: 'div' },
  },
  setup(props, { slots, attrs }) {
    validateGhostlyProps('GhostlyList', {
      animation: props.animation,
      radius: props.radius,
      speed: props.speed,
    })

    const skeletonItems = computed(() => {
      const defaultSlot = slots.default?.()
      const template = slots.item?.() ?? (defaultSlot?.[0] ? [defaultSlot[0]] : null)
      if (!template) return null
      return Array.from({ length: props.count }, (_, i) =>
        h(template[0] as VNode, { key: `ghostly-${i}` }),
      )
    })

    return () => {
      if (props.loading) {
        return h(
          Ghostly,
          {
            loading: true,
            animation: props.animation,
            radius: props.radius,
            speed: props.speed,
            color: props.color,
            shine: props.shine,
            as: props.as,
            ...attrs,
          },
          () => skeletonItems.value,
        )
      }

      return h(props.as, attrs, slots.default?.())
    }
  },
})
