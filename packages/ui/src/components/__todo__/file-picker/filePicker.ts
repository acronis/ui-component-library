export interface AcvFilePickerProps {
  /**
   * Title of the FilePicker
   */
  title?: string

  /**
   * Description of the FilePicker
   */
  description?: string
}

export interface AcvFilePickerEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvFilePickerSlots {
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
