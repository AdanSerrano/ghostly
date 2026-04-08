import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useGhostlyState } from './use-ghostly-state'

describe('useGhostlyState', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  // --- Basic behavior ---

  it('returns true immediately when isLoading=true and delayMs=0', () => {
    const { result } = renderHook(() => useGhostlyState(true))
    expect(result.current).toBe(true)
  })

  it('returns false when isLoading=false', () => {
    const { result } = renderHook(() => useGhostlyState(false))
    expect(result.current).toBe(false)
  })

  it('returns false with default options when never loading', () => {
    const { result } = renderHook(() => useGhostlyState(false, {}))
    expect(result.current).toBe(false)
  })

  // --- Minimum display time ---

  it('holds true for at least minimumMs after isLoading goes false', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading, { minimumMs: 500 }),
      { initialProps: { loading: true } },
    )
    expect(result.current).toBe(true)

    // Data arrives after 100ms — minimum not yet met
    act(() => { vi.advanceTimersByTime(100) })
    rerender({ loading: false })
    expect(result.current).toBe(true)

    // After remaining 400ms, should hide
    act(() => { vi.advanceTimersByTime(400) })
    expect(result.current).toBe(false)
  })

  it('hides immediately when minimumMs already elapsed', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading, { minimumMs: 200 }),
      { initialProps: { loading: true } },
    )

    // Skeleton visible for 300ms, then data arrives
    act(() => { vi.advanceTimersByTime(300) })
    rerender({ loading: false })

    // minimumMs (200) already passed — should hide on next effect
    act(() => { vi.advanceTimersByTime(0) })
    expect(result.current).toBe(false)
  })

  it('works with minimumMs=0 as a pass-through', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading, { minimumMs: 0 }),
      { initialProps: { loading: true } },
    )
    expect(result.current).toBe(true)

    rerender({ loading: false })
    act(() => { vi.advanceTimersByTime(0) })
    expect(result.current).toBe(false)
  })

  // --- Delay before showing ---

  it('does not show skeleton before delayMs elapses', () => {
    const { result } = renderHook(() =>
      useGhostlyState(true, { delayMs: 200 }),
    )
    expect(result.current).toBe(false)

    act(() => { vi.advanceTimersByTime(100) })
    expect(result.current).toBe(false)
  })

  it('shows skeleton after delayMs elapses', () => {
    const { result } = renderHook(() =>
      useGhostlyState(true, { delayMs: 200 }),
    )

    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current).toBe(true)
  })

  it('skips skeleton entirely if data arrives before delayMs', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading, { delayMs: 300 }),
      { initialProps: { loading: true } },
    )
    expect(result.current).toBe(false)

    // Data arrives at 100ms — before 300ms delay
    act(() => { vi.advanceTimersByTime(100) })
    rerender({ loading: false })

    // Advance past delay — skeleton should never appear
    act(() => { vi.advanceTimersByTime(300) })
    expect(result.current).toBe(false)
  })

  // --- onTransitionEnd callback ---

  it('fires onTransitionEnd when skeleton hides', () => {
    const onEnd = vi.fn()
    const { rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading, { minimumMs: 0, onTransitionEnd: onEnd }),
      { initialProps: { loading: true } },
    )

    rerender({ loading: false })
    act(() => { vi.advanceTimersByTime(0) })
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('fires onTransitionEnd after minimumMs extension', () => {
    const onEnd = vi.fn()
    const { rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading, { minimumMs: 500, onTransitionEnd: onEnd }),
      { initialProps: { loading: true } },
    )

    act(() => { vi.advanceTimersByTime(100) })
    rerender({ loading: false })
    expect(onEnd).not.toHaveBeenCalled()

    act(() => { vi.advanceTimersByTime(400) })
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('does not fire onTransitionEnd if skeleton was never shown (delay skip)', () => {
    const onEnd = vi.fn()
    const { rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading, { delayMs: 300, onTransitionEnd: onEnd }),
      { initialProps: { loading: true } },
    )

    act(() => { vi.advanceTimersByTime(100) })
    rerender({ loading: false })
    act(() => { vi.advanceTimersByTime(500) })

    expect(onEnd).not.toHaveBeenCalled()
  })

  // --- Edge cases ---

  it('handles rapid loading->loaded->loading toggles', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading, { minimumMs: 300 }),
      { initialProps: { loading: true } },
    )
    expect(result.current).toBe(true)

    // Quick toggle: loaded then loading again
    rerender({ loading: false })
    act(() => { vi.advanceTimersByTime(50) })
    rerender({ loading: true })

    // Should still be showing skeleton
    expect(result.current).toBe(true)
  })

  it('cleans up timers on unmount', () => {
    const { unmount } = renderHook(() =>
      useGhostlyState(true, { delayMs: 500 }),
    )

    unmount()

    // Should not throw or log warnings after unmount
    act(() => { vi.advanceTimersByTime(1000) })
  })

  it('uses default minimumMs of 300 when no options provided', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading),
      { initialProps: { loading: true } },
    )

    act(() => { vi.advanceTimersByTime(100) })
    rerender({ loading: false })

    // Should hold for remaining 200ms (300 default - 100 elapsed)
    expect(result.current).toBe(true)

    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current).toBe(false)
  })

  // --- Delay + Minimum combined ---

  it('enforces minimumMs after delayMs elapses', () => {
    const onEnd = vi.fn()
    const { result, rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading, { delayMs: 100, minimumMs: 300, onTransitionEnd: onEnd }),
      { initialProps: { loading: true } },
    )

    // Skeleton not visible during delay
    expect(result.current).toBe(false)

    // After delay, skeleton appears
    act(() => { vi.advanceTimersByTime(100) })
    expect(result.current).toBe(true)

    // Data arrives 50ms after skeleton appeared
    act(() => { vi.advanceTimersByTime(50) })
    rerender({ loading: false })

    // Should hold for remaining 250ms of minimumMs
    expect(result.current).toBe(true)

    act(() => { vi.advanceTimersByTime(250) })
    expect(result.current).toBe(false)
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  // --- Additional edge cases ---

  it('does not fire onTransitionEnd more than once per cycle', () => {
    const onEnd = vi.fn()
    const { result, rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading, { minimumMs: 100, onTransitionEnd: onEnd }),
      { initialProps: { loading: true } },
    )

    rerender({ loading: false })
    act(() => { vi.advanceTimersByTime(100) })
    expect(onEnd).toHaveBeenCalledTimes(1)
    expect(result.current).toBe(false)

    // Start a new cycle
    rerender({ loading: true })
    expect(result.current).toBe(true)
    rerender({ loading: false })
    act(() => { vi.advanceTimersByTime(100) })
    expect(onEnd).toHaveBeenCalledTimes(2)
  })

  it('handles unmount during extending phase', () => {
    const onEnd = vi.fn()
    const { rerender, unmount } = renderHook(
      ({ loading }) => useGhostlyState(loading, { minimumMs: 500, onTransitionEnd: onEnd }),
      { initialProps: { loading: true } },
    )

    act(() => { vi.advanceTimersByTime(100) })
    rerender({ loading: false })

    // Unmount while extending (timer pending)
    unmount()
    act(() => { vi.advanceTimersByTime(500) })

    // Callback should not fire after unmount
    // (no error should be thrown either)
  })

  it('handles two independent instances simultaneously', () => {
    const { result: r1, rerender: rerender1 } = renderHook(
      ({ loading }) => useGhostlyState(loading, { minimumMs: 200 }),
      { initialProps: { loading: true } },
    )
    const { result: r2, rerender: rerender2 } = renderHook(
      ({ loading }) => useGhostlyState(loading, { minimumMs: 500 }),
      { initialProps: { loading: true } },
    )

    expect(r1.current).toBe(true)
    expect(r2.current).toBe(true)

    // First finishes loading
    act(() => { vi.advanceTimersByTime(100) })
    rerender1({ loading: false })

    // r1 still extending, r2 still loading
    expect(r1.current).toBe(true)
    expect(r2.current).toBe(true)

    // r1 should hide after its minimumMs
    act(() => { vi.advanceTimersByTime(100) })
    expect(r1.current).toBe(false)
    expect(r2.current).toBe(true)

    // r2 finishes loading
    rerender2({ loading: false })
    act(() => { vi.advanceTimersByTime(300) })
    expect(r2.current).toBe(false)
  })

  it('starts loading=false then transitions to true', () => {
    const { result, rerender } = renderHook(
      ({ loading }) => useGhostlyState(loading, { minimumMs: 200 }),
      { initialProps: { loading: false } },
    )
    expect(result.current).toBe(false)

    rerender({ loading: true })
    act(() => { vi.advanceTimersByTime(0) })
    expect(result.current).toBe(true)

    rerender({ loading: false })
    expect(result.current).toBe(true)
    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current).toBe(false)
  })

  it('uses latest onTransitionEnd if callback changes', () => {
    const onEnd1 = vi.fn()
    const onEnd2 = vi.fn()

    const { rerender } = renderHook(
      ({ loading, cb }) => useGhostlyState(loading, { minimumMs: 100, onTransitionEnd: cb }),
      { initialProps: { loading: true, cb: onEnd1 } },
    )

    // Update callback before loading ends
    rerender({ loading: true, cb: onEnd2 })

    rerender({ loading: false, cb: onEnd2 })
    act(() => { vi.advanceTimersByTime(100) })

    expect(onEnd1).not.toHaveBeenCalled()
    expect(onEnd2).toHaveBeenCalledTimes(1)
  })

  it('handles delayMs with immediate loading=false (never shows)', () => {
    const { result } = renderHook(() =>
      useGhostlyState(false, { delayMs: 200 }),
    )
    expect(result.current).toBe(false)

    act(() => { vi.advanceTimersByTime(500) })
    expect(result.current).toBe(false)
  })
})
