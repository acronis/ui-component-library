import type { IconProp } from '../../types/props.ts';

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type ColorNames = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'accent' | 'neutral' | 'white' | 'black';

type Color = RGB | RGBA | HEX | ColorNames;

export interface IconProps {
  /**
   * Name of icon (e.g. `check` or `i-check--16`)
   */
  name?: string
  /**
   * Name of collection (e.g. `acronis` or `constructor`)
   */
  collection?: string

  /**
   * Name of state icon (e.g. `i-state-upload-d--16`)
   */
  state?: string

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
   * Size of the icon
   * @defaultValue 16
   * @values 16, 24, 32, 48, 64, 72, 96
   */
  size?: string | number

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

  /**
   * Icon is inverted
   * @defaultValue false
   */
  inverse?: boolean

  icon?: IconProp
}
