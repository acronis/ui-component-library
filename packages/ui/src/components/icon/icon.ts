import type { IconSource } from '@/types/icon.ts';
import type { IconProp } from '@/types/props.ts';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type ColorNames = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'accent' | 'neutral' | 'white' | 'black';

type Color = RGB | RGBA | HEX | ColorNames;

export const ICON_SIZES = {
  'xxx-small': '8',
  'xx-small': '10',
  'x-small': '12',
  'small': '16',
  'medium': '24',
  'large': '32',
  'x-large': '48',
  'xx-large': '72',
  'xxx-large': '96'
};
export type AcvIconSize = typeof ICON_SIZES[keyof typeof ICON_SIZES];
export type AcvIconSource = 'function' | 'placeholder' | 'external' | 'dynamic';

export interface AcvIconProps {
  /**
   * Icon name
   */
  name?: string

  /**
   * Icon source
   */
  source?: IconSource

  /**
   * State Icon source
   */
  state?: IconSource

  /**
   * Icon component to display
   */
  icon?: IconProp

  /**
   * State icon component to display
   */
  stateIcon?: IconProp

  /**
   * Size of the icon
   * @defaultValue 'medium'
   * @values 'xxx-small', 'xx-small', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'xxx-large'
   */
  size?: AcvIconSize

  /**
   * Title of the icon
   */
  title?: string

  /**
   * Fill of the icon
   */
  fill?: string

  /**
   * Scale of the icon
   * @defaultValue 1
   */
  scale?: number

  /**
   * Animation of the icon
   * @defaultValue ''
   * @values 'spin', 'pulse', 'bounce', 'flash', 'rubberBand'
   */
  animation?: string

  /**
   * Animate of the icon
   */
  animateOnHover?: boolean

  /**
   * Animation speed of the icon
   * @defaultValue 1
   */
  animationSpeed?: 'fast' | 'slow' | 'slower' | 'fastest' | 'slowest'

  /**
   * Flip of the icon
   */
  flip?: 'horizontal' | 'vertical' | 'both'

  /**
   * Color of the icon
   */
  color?: Color | Color[]

  /**
   * Color of the state icon
   */
  stateColor?: Color

  /**
   * Icon is disabled
   * @defaultValue false
   */
  disabled?: boolean

  /** Determine whether it's right of text */
  right?: boolean

  /** Determine whether it's left of text */
  left?: boolean

  /**
   * Icon is inverted
   * @defaultValue false
   */
  inverse?: boolean
}
