export interface AcvRadioButtonProps {
  /**
   * Title of the RadioButton
   */
  title?: string

  /**
   * Description of the RadioButton
   */
  description?: string
}

export interface AcvRadioButtonEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvRadioButtonSlots {
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
