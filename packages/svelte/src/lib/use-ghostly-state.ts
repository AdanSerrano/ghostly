import { writable, type Readable } from 'svelte/store'

export interface UseGhostlyStateOptions {
  /** Minimum time (ms) the skeleton stays visible once shown. Default: 300 */
  minimumMs?: number
  /** Delay (ms) before showing the skeleton. If data arrives before, skeleton is skipped. Default: 0 */
  delayMs?: number
  /** Called when the skeleton transitions from visible to hidden */
  onTransitionEnd?: () => void
}

interface GhostlyStateStore extends Readable<boolean> {
  /** Update the raw loading state */
  setLoading: (loading: boolean) => void
  /** Clean up timers */
  destroy: () => void
}

/**
 * Creates a debounced loading store to prevent skeleton flash on fast loads.
 *
 * @example
 * ```svelte
 * <script>
 * import { createGhostlyState, ghostly } from '@ghostly-ui/svelte'
 * const { subscribe, setLoading, destroy } = createGhostlyState({ minimumMs: 400 })
 *
 * let loading: boolean
 * subscribe(v => loading = v)
 *
 * // When data fetch starts/ends:
 * setLoading(true)
 * // ... fetch ...
 * setLoading(false)
 * </script>
 *
 * <div use:ghostly={{ loading }}>...</div>
 * ```
 */
export function createGhostlyState(
  options: UseGhostlyStateOptions = {},
): GhostlyStateStore {
  const { minimumMs = 300, delayMs = 0, onTransitionEnd } = options

  const { subscribe, set } = writable(false)
  let timer: ReturnType<typeof setTimeout> | null = null
  let visible = false
  let showStart = 0

  function clearTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function setLoading(loading: boolean) {
    clearTimer()

    if (loading) {
      if (delayMs > 0 && !visible) {
        timer = setTimeout(() => {
          showStart = Date.now()
          visible = true
          set(true)
        }, delayMs)
      } else if (!visible) {
        showStart = Date.now()
        visible = true
        set(true)
      }
    } else if (visible) {
      const elapsed = Date.now() - showStart
      const remaining = Math.max(0, minimumMs - elapsed)

      if (remaining > 0) {
        timer = setTimeout(() => {
          visible = false
          set(false)
          onTransitionEnd?.()
        }, remaining)
      } else {
        visible = false
        set(false)
        onTransitionEnd?.()
      }
    }
  }

  return {
    subscribe,
    setLoading,
    destroy: clearTimer,
  }
}
