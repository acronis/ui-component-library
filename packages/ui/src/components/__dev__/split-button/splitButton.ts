export interface AcvSplitButtonProps {
  /**
   * Title of the SplitButton
   */
  title?: string

  /**
   * Description of the SplitButton
   */
  description?: string
}

export interface AcvSplitButtonEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvSplitButtonSlots {
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
