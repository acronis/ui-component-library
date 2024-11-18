export interface AcvTagProps {
  /**
   * Title of the Tag
   */
  title?: string

  /**
   * Description of the Tag
   */
  description?: string

  /**
   * Whether the Tag is small
   */
  small?: boolean
}

export interface AcvTagEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvTagSlots {
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
