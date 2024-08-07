export interface AcvOptionProps {
  /**
   * Title of the Option
   */
  label?: string

  /**
   * Value of the Option
   */
  value?: string | number

  /**
   * Whether the option is selected
   */
  selected?: boolean

  /**
   * Whether the option is active
   */
  active?: boolean

  /**
   * Whether the option is disabled
   */
  disabled?: boolean
}

export interface AcvOptionEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvOptionSlots {
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
