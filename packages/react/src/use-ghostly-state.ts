import { useEffect, useRef, useState } from 'react'

export interface UseGhostlyStateOptions {
  /** Minimum time (ms) the skeleton stays visible once shown. Default: 300 */
  minimumMs?: number
  /** Delay (ms) before showing the skeleton. If data arrives before, skeleton is skipped. Default: 0 */
  delayMs?: number
  /** Called when the skeleton transitions from visible to hidden */
  onTransitionEnd?: () => void
}

/**
 * Debounces a loading boolean to prevent skeleton flash on fast loads.
 *
 * @param isLoading - The raw loading state from your data source
 * @param options - Timing and callback options
 * @returns A debounced loading boolean safe to pass to `<Ghostly loading={...}>`
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useSWR('/api/products', fetcher)
 * const showSkeleton = useGhostlyState(isLoading, { minimumMs: 400, delayMs: 100 })
 *
 * <Ghostly loading={showSkeleton}>
 *   <ProductCard product={data} />
 * </Ghostly>
 * ```
 */
export function useGhostlyState(
  isLoading: boolean,
  options: UseGhostlyStateOptions = {},
): boolean {
  const { minimumMs = 300, delayMs = 0, onTransitionEnd } = options

  const startVisible = delayMs <= 0 && isLoading
  const [visible, setVisible] = useState(startVisible)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const showStartRef = useRef<number>(startVisible ? Date.now() : 0)
  const callbackRef = useRef(onTransitionEnd)
  callbackRef.current = onTransitionEnd

  useEffect(() => {
    if (isLoading) {
      if (delayMs > 0 && !visible) {
        // Delay phase: wait before showing skeleton
        timerRef.current = setTimeout(() => {
          showStartRef.current = Date.now()
          setVisible(true)
        }, delayMs)
      } else if (!visible) {
        showStartRef.current = Date.now()
        setVisible(true)
      }
    } else if (visible) {
      // Data arrived while skeleton is visible — enforce minimum display time
      const elapsed = Date.now() - showStartRef.current
      const remaining = Math.max(0, minimumMs - elapsed)

      if (remaining > 0) {
        timerRef.current = setTimeout(() => {
          setVisible(false)
          callbackRef.current?.()
        }, remaining)
      } else {
        setVisible(false)
        callbackRef.current?.()
      }
    } else {
      // Data arrived during delay phase — cancel and skip skeleton entirely
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isLoading, delayMs, minimumMs, visible])

  return visible
}
