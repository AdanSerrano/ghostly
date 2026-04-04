import { describe, it, expect } from 'vitest'
import { RADIUS_MAP, SPEED_MAP } from './types'

describe('RADIUS_MAP', () => {
  it('maps all radius values to CSS strings', () => {
    expect(RADIUS_MAP.none).toBe('0px')
    expect(RADIUS_MAP.xs).toBe('2px')
    expect(RADIUS_MAP.sm).toBe('4px')
    expect(RADIUS_MAP.md).toBe('8px')
    expect(RADIUS_MAP.lg).toBe('12px')
    expect(RADIUS_MAP.full).toBe('9999px')
  })

  it('covers all 6 radius options', () => {
    expect(Object.keys(RADIUS_MAP)).toHaveLength(6)
  })
})

describe('SPEED_MAP', () => {
  it('maps all speed values to CSS durations', () => {
    expect(SPEED_MAP.slow).toBe('2s')
    expect(SPEED_MAP.normal).toBe('1.5s')
    expect(SPEED_MAP.fast).toBe('0.8s')
  })

  it('covers all 3 speed options', () => {
    expect(Object.keys(SPEED_MAP)).toHaveLength(3)
  })
})
