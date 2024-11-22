import type { IconSource } from '@/types/icon.ts';
import type { ComponentSize } from '@/types/props.ts';
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

  /** Button icon */
  icon?: IconSource

  /**
   * Determine whether it's loading
   */
  loading?: boolean
}
