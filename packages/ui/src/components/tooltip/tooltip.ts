import type { AcvFloatingProps } from '../popper/popper.ts';

export type AcvTooltipSize = 'auto' | 'md' | 'sm';

export type AcvTransition = 'fade' | 'scale' | 'slide';

export interface AcvTooltipProps extends AcvFloatingProps {
  /**
   * Defines the behavior for maximum width of tooltip
   * @default 'auto'
   * @values 'auto', 'none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl'
   */
  maxWidth?: string | number

  /**
   * Size of the tooltip
   * @default 'auto'
   * @values tooltipSize
   */
  size?: AcvTooltipSize

  /**
   * Content of the tooltip
   */
  content?: string
}

export interface AcvTooltipSlots {
  /**
   * Default slot content for anchor
   */
  default: void
  /**
   * Custom content of the tooltip
   */
  content: void
}
