export interface AcvRadioProps {
  /**
   * Title of the Radio
   */
  title?: string

  /**
   * Description of the Radio
   */
  description?: string
}

export interface AcvRadioEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvRadioSlots {
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
