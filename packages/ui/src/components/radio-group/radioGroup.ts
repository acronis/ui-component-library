export interface AcvRadioGroupProps {
  /**
   * Title of the RadioGroup
   */
  title?: string

  /**
   * Description of the RadioGroup
   */
  description?: string
}

export interface AcvRadioGroupEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvRadioGroupSlots {
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
