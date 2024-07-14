import type { ColorProp, ComponentSize } from '../../types/props.ts';

export interface AcvIconButtonProps {
  /**
   * Size of the IconButton
   * @defaultValue 'medium'
   * @values 'small', 'medium', 'large'
   */
  size?: ComponentSize

  /**
   * Color of the IconButton
   * @type {string}
   * @defaultValue 'primary'
   * @values 'primary', 'secondary', 'success', 'info', 'warning', 'error'
   */
  color?: ColorProp
}

export interface AcvIconButtonEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvIconButtonSlots {
  /**
   * Slot for the IconButton icon
   */
  default: void
}
