import type { AcvPopperProps } from '../popper/popper.ts';

export interface AcvPopoverProps extends AcvPopperProps {
  block?: boolean

  contentClass?: string

  /**
   * Whether the popover is loading
   */
  loading?: boolean

  keepAlive?: boolean

  color?: string

  /**
   * The width of the popover
   * @defaultValue '150'
   */
  width?: number | string
}

export interface AcvPopoverEvents {
  /**
   * Triggered when the component is toggled
   * @arg {string} eventName - The name of the event
   * @arg {boolean} value - The visibility state of the component
   */
  (eventName: 'update:modelValue', value: boolean): void

  /**
   * Triggered when the component is hidden
   * @arg {string} eventName - The name of the event
   */
  (eventName: 'hide'): void

  /**
   * Triggered when the component is shown
   * @arg {string} eventName - The name of the event
   */
  (eventName: 'show'): void
}

export interface AcvPopoverSlots {
  /**
   * The default slot for floating content
   * @binding {boolean} visible - The visibility state of the component
   * @binding {Function} close - The function to toggle the visibility state of the component
   */
  default: void

  /**
   *  HTML element with the popover trigger
   */
  reference: void

  /**
   *  HTML element with the popover actions
   */
  actions: any
}
