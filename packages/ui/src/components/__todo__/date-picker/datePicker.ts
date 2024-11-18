export interface AcvDatePickerProps {
  /**
   * Title of the DatePicker
   */
  title?: string

  /**
   * Description of the DatePicker
   */
  description?: string
}

export interface AcvDatePickerEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvDatePickerSlots {
  /**
   * The default slot content
   */
  default: void
  /**
   * The description slot content
   * @binding {string} description - The description prop value
   */
  description: void
}
