import { describe, it, expect, vi, afterEach } from 'vitest'
import { RADIUS_MAP, SPEED_MAP, CSS_VARS, validateGhostlyProps } from './types'
import type { GhostlyAnimation, GhostlyRadius, GhostlySpeed, GhostlyConfig } from './types'

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

  it('all values are valid CSS length strings', () => {
    for (const value of Object.values(RADIUS_MAP)) {
      expect(value).toMatch(/^\d+px$/)
    }
  })

  it('values are ordered from smallest to largest (except full)', () => {
    const values = ['none', 'xs', 'sm', 'md', 'lg'] as const
    for (let i = 0; i < values.length - 1; i++) {
      const current = parseInt(RADIUS_MAP[values[i]])
      const next = parseInt(RADIUS_MAP[values[i + 1]])
      expect(next).toBeGreaterThan(current)
    }
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

  it('all values are valid CSS duration strings', () => {
    for (const value of Object.values(SPEED_MAP)) {
      expect(value).toMatch(/^\d+\.?\d*s$/)
    }
  })

  it('fast is faster than normal, normal is faster than slow', () => {
    const fast = parseFloat(SPEED_MAP.fast)
    const normal = parseFloat(SPEED_MAP.normal)
    const slow = parseFloat(SPEED_MAP.slow)
    expect(fast).toBeLessThan(normal)
    expect(normal).toBeLessThan(slow)
  })
})

describe('CSS_VARS', () => {
  it('exports all 4 CSS custom property names', () => {
    expect(CSS_VARS.color).toBe('--ghostly-color')
    expect(CSS_VARS.shine).toBe('--ghostly-shine')
    expect(CSS_VARS.radius).toBe('--ghostly-radius')
    expect(CSS_VARS.speed).toBe('--ghostly-speed')
  })

  it('has exactly 5 properties', () => {
    expect(Object.keys(CSS_VARS)).toHaveLength(5)
  })

  it('all values start with --ghostly-', () => {
    for (const value of Object.values(CSS_VARS)) {
      expect(value).toMatch(/^--ghostly-/)
    }
  })
})

describe('type safety', () => {
  it('GhostlyAnimation accepts valid values', () => {
    const values: GhostlyAnimation[] = ['shimmer', 'pulse', 'wave', 'none']
    expect(values).toHaveLength(4)
  })

  it('GhostlyRadius accepts valid values', () => {
    const values: GhostlyRadius[] = ['none', 'xs', 'sm', 'md', 'lg', 'full']
    expect(values).toHaveLength(6)
  })

  it('GhostlySpeed accepts valid values', () => {
    const values: GhostlySpeed[] = ['slow', 'normal', 'fast']
    expect(values).toHaveLength(3)
  })

  it('GhostlyConfig is fully optional', () => {
    const empty: GhostlyConfig = {}
    const partial: GhostlyConfig = { animation: 'pulse' }
    const full: GhostlyConfig = { animation: 'shimmer', radius: 'md', speed: 'fast' }
    expect(empty).toBeDefined()
    expect(partial).toBeDefined()
    expect(full).toBeDefined()
  })
})

describe('validateGhostlyProps', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    vi.restoreAllMocks()
  })

  it('warns on invalid animation in development', () => {
    process.env.NODE_ENV = 'development'
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    validateGhostlyProps('Ghostly', { animation: 'invalid' as GhostlyAnimation })
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('invalid animation'))
  })

  it('warns on invalid radius in development', () => {
    process.env.NODE_ENV = 'development'
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    validateGhostlyProps('Ghostly', { radius: 'huge' as GhostlyRadius })
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('invalid radius'))
  })

  it('warns on invalid speed in development', () => {
    process.env.NODE_ENV = 'development'
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    validateGhostlyProps('Ghostly', { speed: 'turbo' as GhostlySpeed })
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('invalid speed'))
  })

  it('does not warn for valid props', () => {
    process.env.NODE_ENV = 'development'
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    validateGhostlyProps('Ghostly', { animation: 'shimmer', radius: 'md', speed: 'fast' })
    expect(spy).not.toHaveBeenCalled()
  })

  it('does not warn when props are undefined', () => {
    process.env.NODE_ENV = 'development'
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    validateGhostlyProps('Ghostly', {})
    expect(spy).not.toHaveBeenCalled()
  })

  it('does not warn in production', () => {
    process.env.NODE_ENV = 'production'
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    validateGhostlyProps('Ghostly', { animation: 'invalid' as GhostlyAnimation })
    expect(spy).not.toHaveBeenCalled()
  })

  it('includes component name in warning', () => {
    process.env.NODE_ENV = 'development'
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    validateGhostlyProps('GhostlyList', { animation: 'bad' as GhostlyAnimation })
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('<GhostlyList>'))
  })
})
