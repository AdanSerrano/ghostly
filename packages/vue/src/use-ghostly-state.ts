import { ref, watch, onUnmounted, type Ref } from 'vue'

export interface UseGhostlyStateOptions {
  /** Minimum time (ms) the skeleton stays visible once shown. Default: 300 */
  minimumMs?: number
  /** Delay (ms) before showing the skeleton. If data arrives before, skeleton is skipped. Default: 0 */
  delayMs?: number
  /** Called when the skeleton transitions from visible to hidden */
  onTransitionEnd?: () => void
}

/**
 * Debounces a loading ref to prevent skeleton flash on fast loads.
 *
 * @example
 * ```vue
 * <script setup>
 * const isLoading = ref(true)
 * const showSkeleton = useGhostlyState(isLoading, { minimumMs: 400 })
 * </script>
 * <template>
 *   <Ghostly :loading="showSkeleton.value">...</Ghostly>
 * </template>
 * ```
 */
export function useGhostlyState(
  isLoading: Ref<boolean>,
  options: UseGhostlyStateOptions = {},
): Ref<boolean> {
  const { minimumMs = 300, delayMs = 0, onTransitionEnd } = options

  const visible = ref(delayMs <= 0 && isLoading.value)
  let timer: ReturnType<typeof setTimeout> | null = null
  let showStart = visible.value ? Date.now() : 0

  function clearTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  // Handle initial state: if loading starts true with delay, start the delay timer
  if (isLoading.value && delayMs > 0 && !visible.value) {
    timer = setTimeout(() => {
      showStart = Date.now()
      visible.value = true
    }, delayMs)
  }

  watch(
    isLoading,
    (loading) => {
      clearTimer()

      if (loading) {
        if (delayMs > 0 && !visible.value) {
          timer = setTimeout(() => {
            showStart = Date.now()
            visible.value = true
          }, delayMs)
        } else if (!visible.value) {
          showStart = Date.now()
          visible.value = true
        }
      } else if (visible.value) {
        const elapsed = Date.now() - showStart
        const remaining = Math.max(0, minimumMs - elapsed)

        if (remaining > 0) {
          timer = setTimeout(() => {
            visible.value = false
            onTransitionEnd?.()
          }, remaining)
        } else {
          visible.value = false
          onTransitionEnd?.()
        }
      }
    },
    { immediate: false },
  )

  onUnmounted(clearTimer)

  return visible
}
