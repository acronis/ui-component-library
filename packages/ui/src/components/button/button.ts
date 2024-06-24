import type { ColorProp, ComponentSize, IconProp } from '../../types/props.ts';

export const BUTTON_KIND = {
  solid: 'solid',
  outline: 'outline',
  ghost: 'ghost',
} as const;

export const BUTTON_COLOR = {
  primary: 'primary',
  secondary: 'secondary',
  success: 'success',
  danger: 'danger',
  warning: 'warning',
  info: 'info',
  inverted: 'inverted',
} as const;

export const BUTTON_VARIANT = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'ghost',
  danger: 'danger',
  success: 'success',
  warning: 'warning',
  info: 'info',
  inverted: 'inverted',
} as const;

export type AcvButtonVariant = typeof BUTTON_VARIANT[keyof typeof BUTTON_VARIANT];

export type AcvButtonHeight = '32' | '48';

export type AcvButtonSize = ComponentSize;

export type AcvButtonKind = typeof BUTTON_KIND[keyof typeof BUTTON_KIND];

export interface AcvButtonProps {
  /**
   * Button tag
   * @values a, span, button, label
   */
  tag?: 'a' | 'span' | 'button' | 'label'

  /**
   * Button type
   * @values button, submit, reset
   * @defaultValue button
   */
  buttonType?: 'button' | 'submit' | 'reset'

  /**
   * Button variant
   * @values primary, secondary, ghost, danger, inverted
   * @defaultValue primary
   * @since 0.0.3
   */
  variant?: AcvButtonVariant

  /**
   * Button icon, accepts an icon name of Icon component
   */
  icon?: IconProp

  /**
   * Color of the button
   * @values primary, secondary, success, danger, warning, info, inverted, light, dark
   */
  color?: ColorProp

  /**
   * Button height for fluid variant
   * @values 32, 48
   */
  height?: AcvButtonHeight

  /**
   * Button size
   * @type ComponentSize
   * @values small, medium, large
   * @defaultValue medium
   */
  size?: AcvButtonSize

  /** Same as native button's autofocus */
  autofocus?: boolean

  /** Disable the button */
  disabled?: boolean

  /**
   * Determine whether it's loading
   */
  loading?: boolean

  /** Whether button should fill all available width */
  fluid?: boolean

  /** Turn on multiline mode */
  multiline?: boolean

  /**
   *  Button icon on the right side,
   *  accepts an icon name of Icon component
   */
  rightIcon?: IconProp

  kind?: AcvButtonKind

  // /**
  //  *  Whether the button is solid style or not
  //  */
  // solid?: boolean
  //
  // /**
  //  *  Whether the button is outline style or not
  //  */
  // outline?: boolean
  //
  // /**
  //  *  Whether the button is ghost style or not
  //  */
  // ghost?: boolean

  /**
   *  Whether the button is block style or not
   */
  block?: boolean

  pill?: boolean

  squared?: boolean

  /**
   * Button router-link path
   */
  to?: string | object
}

export interface AcvButtonSlots {
  /**
   * The default slot content
   */
  default: void

  /**
   * Icon slot content
   */
  icon: void

  /**
   * Icon on the right side slot content
   */
  iconRight: void
}
