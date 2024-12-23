import type { ColorBrand, ColorStatus } from '@/utils/color.ts';

export type AcvDividerTextPosition = 'center' | 'left' | 'right';

export interface AcvDividerProps {
  /**
   * Orientation and height of the Divider
   */
  vertical?: boolean | number

  /**
   * Position of the text in the Divider
   */
  textPosition?: AcvDividerTextPosition

  /**
   * Margin of the Divider
   */
  margin?: string | number

  /**
   * Color of the Divider
   * @defaultValue 'brand'
   * @values 'primary', 'secondary', 'neutral', 'success', 'warning', 'danger', 'info'
   */
  color?: ColorBrand | ColorStatus
}
