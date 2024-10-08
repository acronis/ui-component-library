export interface AcvMenuGroupProps {
  /**
   * Title of the MenuGroup
   */
  title?: string
}

export interface AcvMenuGroupEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvMenuGroupSlots {
  /**
   * The default slot content
   */
  default: void
  /**
   * The title slot content
   * @binding {string} description - The description prop value
   */
  title: string | (() => NonNullable<unknown>)
}
