export interface AcvCheckboxButtonProps {
  /**
   * Title of the CheckboxButton
   */
  title?: string

  /**
   * Description of the CheckboxButton
   */
  description?: string
}

export interface AcvCheckboxButtonEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvCheckboxButtonSlots {
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
