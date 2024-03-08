import { UIKitComponent } from './component'

export type IconColor =
  | 'brand-primary'
  | 'brand-light'
  | 'brand-secondary'
  | 'brand-secondary-light'
  | 'fixed-primary'
  | 'fixed-secondary'
  | 'fixed-light'
  | 'fixed-lighter'
  | 'fixed-lightest'
  | 'fixed-success'
  | 'fixed-success-accent'
  | 'fixed-success-dark'
  | 'fixed-success-dark-accent'
  | 'fixed-danger-dark'
  | 'fixed-danger'
  | 'fixed-danger-light'
  | 'fixed-danger-accent'
  | 'fixed-critical-dark'
  | 'fixed-critical'
  | 'fixed-critical-light'
  | 'fixed-critical-accent'
  | 'fixed-warning-dark'
  | 'fixed-warning'
  | 'fixed-warning-light'
  | 'fixed-warning-accent'
  | 'fixed-info-dark'
  | 'fixed-info'
  | 'fixed-info-light'
  | 'fixed-info-accent'
  | 'fixed-neutral-dark'
  | 'fixed-neutral'
  | 'fixed-neutral-light'
  | 'fixed-neutral-accent'
  | 'fixed-white'
  | 'fixed-link-dark'
  | 'fixed-link'
  | 'fixed-link-light'
  | 'solid-brand-accent'
  | 'solid-brand-lightest'
  | 'solid-brand-secondary-accent'
  | 'solid-brand-secondary-light'
  | 'solid-fixed-success-accent'
  | 'solid-fixed-warning-accent'
  | 'solid-fixed-critical-accent'
  | 'solid-fixed-danger-accent'
  | 'solid-fixed-info-accent';
export type IconVariant =  '16' | '24' | '32'
export type IconSize = '10' | '12' | '16' | '24' | '32' | '64' | '128' | '256'

/** Icon Component */
export declare class ElIcon extends UIKitComponent {
  /** Icon name */
  name: string

  /** State name */
  state: string | boolean

  /** Icon color. Only applicable to monocolor icons. */
  color: IconColor

  /** Icon size */
  size: IconSize

  /** Determine whether it's icon disabled. Only applicable to monocolor icons. */
  disabled: boolean

  /** Need to set to `true` for svg icon when short name (eg. `synced`) is used. Works only when legacy is set to true. */
  useSvg: boolean

  /** Complete path to the svg sprite. Works only when legacy is set to true. */
  svgSpritePath: string

  /** Determine whether it's right of text */
  right: boolean

  /** Determine whether it's left of text */
  left: boolean

  /** Variant of icon */
  variant: IconVariant

  /** Whether to use previous version of the icon system */
  legacy: boolean
}
