export interface AcvDisclosureProps {
  /**
   * Title of the Disclosure
   */
  title?: string

  /**
   * Description of the Disclosure
   */
  description?: string
}

export interface AcvDisclosureEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvDisclosureSlots {
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
