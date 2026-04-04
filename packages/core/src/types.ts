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

/** Valid values for each prop (used for dev validation) */
export const VALID_ANIMATIONS: readonly string[] = ['shimmer', 'pulse', 'wave', 'none']
export const VALID_RADII: readonly string[] = ['none', 'xs', 'sm', 'md', 'lg', 'full']
export const VALID_SPEEDS: readonly string[] = ['slow', 'normal', 'fast']

/**
 * Validates Ghostly config props in development.
 * No-op in production builds (tree-shaken via process.env.NODE_ENV check).
 */
export function validateGhostlyProps(
  component: string,
  props: Partial<GhostlyConfig>,
): void {
  if (process.env.NODE_ENV === 'production') return

  if (props.animation && !VALID_ANIMATIONS.includes(props.animation)) {
    console.warn(
      `[Ghostly] <${component}> received invalid animation="${props.animation}". ` +
      `Valid values: ${VALID_ANIMATIONS.join(', ')}`,
    )
  }
  if (props.radius && !VALID_RADII.includes(props.radius)) {
    console.warn(
      `[Ghostly] <${component}> received invalid radius="${props.radius}". ` +
      `Valid values: ${VALID_RADII.join(', ')}`,
    )
  }
  if (props.speed && !VALID_SPEEDS.includes(props.speed)) {
    console.warn(
      `[Ghostly] <${component}> received invalid speed="${props.speed}". ` +
      `Valid values: ${VALID_SPEEDS.join(', ')}`,
    )
  }
}
