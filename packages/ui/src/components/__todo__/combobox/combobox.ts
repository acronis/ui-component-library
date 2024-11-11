export interface AcvComboboxProps {
  /**
   * Title of the Combobox
   */
  title?: string

  /**
   * Description of the Combobox
   */
  description?: string
}

export interface AcvComboboxEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvComboboxSlots {
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
