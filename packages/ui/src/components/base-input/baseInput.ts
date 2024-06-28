export interface AcvBaseInputProps {
  /**
   * Title of the BaseInput
   */
  title?: string

  /**
   * Description of the BaseInput
   */
  description?: string
}

export interface AcvBaseInputEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvBaseInputSlots {
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
