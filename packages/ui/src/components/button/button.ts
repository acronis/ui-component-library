import type { ComponentSize, IconProp } from '@/types/props.ts';
import type { ColorBrand, ColorStatus } from '@/utils/color.ts';
import type { ButtonHTMLAttributes } from 'vue';
import type { RouterLink } from 'vue-router';
import { BRAND_COLORS, STATUS_COLORS } from '@/utils/color.ts';

export const BUTTON_TYPE = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'ghost',
  danger: 'danger',
  inverted: 'inverted',
} as const;

export const BUTTON_VARIANT = {
  solid: 'solid',
  outline: 'outline',
  ghost: 'ghost',
  light: 'light',
} as const;

export const BUTTON_COLOR = {
  ...BRAND_COLORS,
  ...STATUS_COLORS
} as const;

export type AcvButtonType = 'primary' | 'secondary' | 'ghost' | 'danger' | 'inverted';
export type ButtonColor = ColorBrand | ColorStatus;

export type AcvButtonVariant = typeof BUTTON_VARIANT[keyof typeof BUTTON_VARIANT];

export type AcvButtonSize = ComponentSize;

export interface AcvButtonProps {
  /**
   * Button type
   * @values primary, secondary, ghost, danger, inverted
   */
  type?: AcvButtonType

  /**
   * Button variant
   * @values solid, outline, ghost, light
   * @defaultValue solid
   */
  variant?: AcvButtonVariant

  /**
   * Color of the button
   * @values primary, secondary, inverted, neutral, info, warning, success, critical, danger, info
   * @defaultValue primary
   */
  color?: ButtonColor

  /**
   * Button tag
   * @values a, span, button, label, RouterLink
   * @defaultValue button
   */
  is?: 'a' | 'span' | 'button' | 'label' | typeof RouterLink

  /**
   * Button type
   * @values button, submit, reset
   * @defaultValue button
   */
  buttonType?: ButtonHTMLAttributes['type']

  /**
   * Button icon, accepts an icon name of Icon component
   */
  icon?: IconProp

  /**
   * Button size
   * @type ComponentSize
   * @values small, medium, large
   * @defaultValue medium
   */
  size?: AcvButtonSize

  /** Whether button appearance as selected */
  selected?: boolean

  /** Same as native button's autofocus */
  autofocus?: boolean

  /** Disable the button */
  disabled?: boolean

  /**
   * Determine whether it's loading
   */
  loading?: boolean

  /**
   *  Button icon on the right side,
   *  accepts any Icon component
   */
  appendIcon?: IconProp

  /**
   *  Whether the button is block styled or not
   *  @defaultValue false
   */
  block?: boolean

  /**
   * Whether the button is rounded or not
   * @defaultValue false
   */
  pill?: boolean

  /**
   * Whether the button is squared or not
   * @defaultValue false
   */
  squared?: boolean
}

export interface AcvButtonSlots {
  /**
   * The default slot content
   */
  default: void

  /**
   * Left side slot content
   */
  prepend: void

  /**
   * Right side slot content
   */
  append: void
}
