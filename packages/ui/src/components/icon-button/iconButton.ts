export interface IconButtonProps {
  /**
   * Size of the IconButton
   * @defaultValue 'medium'
   * @values 'small', 'medium', 'large'
   */
  size?: string

  /**
   * Color of the IconButton
   * @type {string | Function}
   * @defaultValue 'primary'
   * @values 'primary', 'secondary', 'success', 'info', 'warning', 'error'
   */
  color?: string | Function
}

export interface IconButtonEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface IconButtonSlots {
  /**
   * Slot for the IconButton icon
   */
  default: void
}
