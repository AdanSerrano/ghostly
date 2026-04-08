import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref, type Ref } from 'vue'
import { useGhostlyState, type UseGhostlyStateOptions } from '../use-ghostly-state'

function createWrapper(initialLoading: boolean, options?: UseGhostlyStateOptions) {
  let loadingRef!: Ref<boolean>
  let visibleRef!: Ref<boolean>

  const Comp = defineComponent({
    setup() {
      loadingRef = ref(initialLoading)
      visibleRef = useGhostlyState(loadingRef, options)
      return () => h('div', { 'data-visible': String(visibleRef.value) })
    },
  })

  const wrapper = mount(Comp)
  return { wrapper, loading: loadingRef, visible: visibleRef }
}

describe('useGhostlyState (Vue)', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('returns true immediately when loading=true and delayMs=0', () => {
    const { visible } = createWrapper(true)
    expect(visible.value).toBe(true)
  })

  it('returns false when loading=false', () => {
    const { visible } = createWrapper(false)
    expect(visible.value).toBe(false)
  })

  it('returns false with delayMs>0 initially', () => {
    const { visible } = createWrapper(true, { delayMs: 200 })
    expect(visible.value).toBe(false)
  })

  it('shows skeleton after delayMs', async () => {
    const { visible } = createWrapper(true, { delayMs: 200 })
    expect(visible.value).toBe(false)

    vi.advanceTimersByTime(200)
    expect(visible.value).toBe(true)
  })

  it('works with minimumMs=0 as pass-through', async () => {
    const { visible, loading, wrapper } = createWrapper(true, { minimumMs: 0 })
    expect(visible.value).toBe(true)

    loading.value = false
    await wrapper.vm.$nextTick()
    expect(visible.value).toBe(false)
  })

  it('respects minimumMs before hiding', async () => {
    const { visible, loading, wrapper } = createWrapper(true, { minimumMs: 500 })
    expect(visible.value).toBe(true)

    vi.advanceTimersByTime(100)
    loading.value = false
    await wrapper.vm.$nextTick()

    // Still visible — minimum not met
    expect(visible.value).toBe(true)

    vi.advanceTimersByTime(400)
    expect(visible.value).toBe(false)
  })

  it('fires onTransitionEnd when skeleton hides', async () => {
    const onEnd = vi.fn()
    const { loading, wrapper } = createWrapper(true, { minimumMs: 0, onTransitionEnd: onEnd })

    loading.value = false
    await wrapper.vm.$nextTick()
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('skips skeleton if data arrives before delayMs', async () => {
    const { visible, loading, wrapper } = createWrapper(true, { delayMs: 300 })
    expect(visible.value).toBe(false)

    vi.advanceTimersByTime(100)
    loading.value = false
    await wrapper.vm.$nextTick()

    vi.advanceTimersByTime(300)
    expect(visible.value).toBe(false)
  })

  it('cleans up on unmount', () => {
    const { wrapper } = createWrapper(true, { delayMs: 500 })
    wrapper.unmount()
    // Advancing timers should not throw
    vi.advanceTimersByTime(1000)
  })
})
