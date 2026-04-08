import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createGhostlyState } from '../use-ghostly-state'

describe('createGhostlyState (Svelte)', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('starts as false', () => {
    const store = createGhostlyState()
    let value = false
    store.subscribe(v => { value = v })
    expect(value).toBe(false)
  })

  it('becomes true when setLoading(true)', () => {
    const store = createGhostlyState()
    let value = false
    store.subscribe(v => { value = v })

    store.setLoading(true)
    expect(value).toBe(true)
  })

  it('respects minimumMs before hiding', () => {
    const store = createGhostlyState({ minimumMs: 500 })
    let value = false
    store.subscribe(v => { value = v })

    store.setLoading(true)
    expect(value).toBe(true)

    vi.advanceTimersByTime(100)
    store.setLoading(false)
    // Still visible — minimum not met
    expect(value).toBe(true)

    vi.advanceTimersByTime(400)
    expect(value).toBe(false)
  })

  it('hides immediately when minimumMs already elapsed', () => {
    const store = createGhostlyState({ minimumMs: 200 })
    let value = false
    store.subscribe(v => { value = v })

    store.setLoading(true)
    vi.advanceTimersByTime(300)
    store.setLoading(false)
    expect(value).toBe(false)
  })

  it('delays showing skeleton with delayMs', () => {
    const store = createGhostlyState({ delayMs: 200 })
    let value = false
    store.subscribe(v => { value = v })

    store.setLoading(true)
    expect(value).toBe(false)

    vi.advanceTimersByTime(200)
    expect(value).toBe(true)
  })

  it('skips skeleton if data arrives before delayMs', () => {
    const store = createGhostlyState({ delayMs: 300 })
    let value = false
    store.subscribe(v => { value = v })

    store.setLoading(true)
    expect(value).toBe(false)

    vi.advanceTimersByTime(100)
    store.setLoading(false)

    vi.advanceTimersByTime(300)
    expect(value).toBe(false)
  })

  it('fires onTransitionEnd when skeleton hides', () => {
    const onEnd = vi.fn()
    const store = createGhostlyState({ minimumMs: 0, onTransitionEnd: onEnd })
    store.subscribe(() => {})

    store.setLoading(true)
    store.setLoading(false)
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('fires onTransitionEnd after minimumMs', () => {
    const onEnd = vi.fn()
    const store = createGhostlyState({ minimumMs: 300, onTransitionEnd: onEnd })
    store.subscribe(() => {})

    store.setLoading(true)
    vi.advanceTimersByTime(100)
    store.setLoading(false)
    expect(onEnd).not.toHaveBeenCalled()

    vi.advanceTimersByTime(200)
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('cleans up on destroy', () => {
    const store = createGhostlyState({ minimumMs: 500 })
    store.subscribe(() => {})

    store.setLoading(true)
    vi.advanceTimersByTime(100)
    store.setLoading(false)

    // Destroy while timer pending
    store.destroy()
    vi.advanceTimersByTime(500)
    // Should not throw
  })

  it('works with minimumMs=0 as pass-through', () => {
    const store = createGhostlyState({ minimumMs: 0 })
    let value = false
    store.subscribe(v => { value = v })

    store.setLoading(true)
    expect(value).toBe(true)

    store.setLoading(false)
    expect(value).toBe(false)
  })

  it('handles delayMs + minimumMs combined', () => {
    const onEnd = vi.fn()
    const store = createGhostlyState({ delayMs: 100, minimumMs: 300, onTransitionEnd: onEnd })
    let value = false
    store.subscribe(v => { value = v })

    store.setLoading(true)
    expect(value).toBe(false)

    // After delay, skeleton appears
    vi.advanceTimersByTime(100)
    expect(value).toBe(true)

    // Data arrives 50ms later
    vi.advanceTimersByTime(50)
    store.setLoading(false)
    expect(value).toBe(true) // Still extending

    // After remaining minimumMs
    vi.advanceTimersByTime(250)
    expect(value).toBe(false)
    expect(onEnd).toHaveBeenCalledTimes(1)
  })
})
