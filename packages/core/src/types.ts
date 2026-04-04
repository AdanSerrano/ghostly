export type GhostlyAnimation = 'shimmer' | 'pulse' | 'wave' | 'none'

export type GhostlyRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'full'

export type GhostlySpeed = 'slow' | 'normal' | 'fast'

export interface GhostlyConfig {
  /** Animation style. Default: 'shimmer' */
  animation?: GhostlyAnimation
  /** Border radius for skeleton blocks. Default: 'sm' */
  radius?: GhostlyRadius
  /** Animation speed. Default: 'normal' */
  speed?: GhostlySpeed
  /** Custom skeleton base color (any CSS color value) */
  color?: string
  /** Custom shimmer highlight color (any CSS color value) */
  shine?: string
}

/** CSS custom property names used by Ghostly */
export const CSS_VARS = {
  color: '--ghostly-color',
  shine: '--ghostly-shine',
  radius: '--ghostly-radius',
  speed: '--ghostly-speed',
} as const

/** Maps radius prop to CSS value */
export const RADIUS_MAP: Record<GhostlyRadius, string> = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
}

/** Maps speed prop to CSS duration */
export const SPEED_MAP: Record<GhostlySpeed, string> = {
  slow: '2s',
  normal: '1.5s',
  fast: '0.8s',
}
