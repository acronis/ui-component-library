export interface AcvMainProps {
  /**
   * Background color of the Main
   * @values transparent, primary, secondary, success, warning, danger, info, light, dark
   */
  color?: string
}

export interface AcvMainEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvMainSlots {
  /**
   * The default slot content
   */
  default: void
}
