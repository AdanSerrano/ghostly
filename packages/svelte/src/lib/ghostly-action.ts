import { RADIUS_MAP, SPEED_MAP, type GhostlyAnimation, type GhostlyRadius, type GhostlySpeed } from '@ghostly-ui/core'

export interface GhostlyActionParams {
  /** When true, shows skeleton effect on the element */
  loading: boolean
  animation?: GhostlyAnimation
  radius?: GhostlyRadius
  speed?: GhostlySpeed
  color?: string
  shine?: string
  smooth?: boolean
}

/**
 * Svelte action that applies Ghostly skeleton styles to any element.
 *
 * @example
 * ```svelte
 * <script>
 * import { ghostly } from '@ghostly-ui/svelte'
 * let loading = $state(true)
 * </script>
 *
 * <div use:ghostly={{ loading, animation: 'shimmer' }}>
 *   <h2>Product Title</h2>
 *   <p>Description</p>
 * </div>
 * ```
 */
export function ghostly(node: HTMLElement, params: GhostlyActionParams) {
  function update(p: GhostlyActionParams) {
    const animation = p.animation ?? 'shimmer'
    const radius = p.radius ?? 'sm'
    const speed = p.speed ?? 'normal'

    if (p.loading) {
      node.setAttribute('data-ghostly', animation)
      node.setAttribute('aria-busy', 'true')
      node.style.setProperty('--ghostly-radius', RADIUS_MAP[radius])
      node.style.setProperty('--ghostly-speed', SPEED_MAP[speed])
      if (p.color) node.style.setProperty('--ghostly-color', p.color)
      if (p.shine) node.style.setProperty('--ghostly-shine', p.shine)
    } else {
      node.removeAttribute('data-ghostly')
      node.removeAttribute('aria-busy')
      node.style.removeProperty('--ghostly-radius')
      node.style.removeProperty('--ghostly-speed')
      node.style.removeProperty('--ghostly-color')
      node.style.removeProperty('--ghostly-shine')
    }

    if (p.smooth) {
      node.setAttribute('data-ghostly-smooth', '')
    } else {
      node.removeAttribute('data-ghostly-smooth')
    }

    node.setAttribute('aria-live', 'polite')
  }

  update(params)

  return {
    update,
    destroy() {
      node.removeAttribute('data-ghostly')
      node.removeAttribute('data-ghostly-smooth')
      node.removeAttribute('aria-busy')
      node.removeAttribute('aria-live')
      node.style.removeProperty('--ghostly-radius')
      node.style.removeProperty('--ghostly-speed')
      node.style.removeProperty('--ghostly-color')
      node.style.removeProperty('--ghostly-shine')
    },
  }
}
