import type { ComponentSize } from '@/types/props.ts';

export interface AcvSpinnerProps {
  /**
   * Color of the Spinner
   */
  color?: string

  /**
   * Size of the Spinner
   */
  size?: ComponentSize | 'x-large'
}
