export interface AcvAutocompleteProps {
  /**
   * Title of the Autocomplete
   */
  title?: string

  /**
   * Description of the Autocomplete
   */
  description?: string
}

export interface AcvAutocompleteEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvAutocompleteSlots {
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
