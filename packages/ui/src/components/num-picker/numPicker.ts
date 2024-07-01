export interface AcvNumPickerProps {
  /**
   * Title of the NumPicker
   */
  title?: string

  /**
   * Description of the NumPicker
   */
  description?: string
}

export interface AcvNumPickerEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvNumPickerSlots {
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
