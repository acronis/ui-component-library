export interface AcvSpinnerProps {
  /**
   * Title of the Spinner
   */
  title?: string

  /**
   * Description of the Spinner
   */
  description?: string
}

export interface AcvSpinnerEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvSpinnerSlots {
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
