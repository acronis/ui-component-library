import type { ComponentSize, IconProp } from '@/types/props.ts';
import type { ButtonHTMLAttributes } from 'vue';
import type { RouterLink } from 'vue-router';

export const BUTTON_VARIANT = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'ghost',
  status: 'status',
  inverted: 'inverted',
} as const;

export type AcvButtonVariant = typeof BUTTON_VARIANT[keyof typeof BUTTON_VARIANT];

export type AcvButtonSize = ComponentSize;

export interface AcvButtonProps {
  /**
   * Button variant
   * @values primary, secondary, ghost, inverted
   * @defaultValue primary
   */
  variant?: AcvButtonVariant

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
  type?: ButtonHTMLAttributes['type']

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
