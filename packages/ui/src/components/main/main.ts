export interface MainProps {
  /**
   * Background color of the Main
   * @values transparent, primary, secondary, success, warning, danger, info, light, dark
   */
  color?: string
}

export interface MainEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface MainSlots {
  /**
   * The default slot content
   */
  default: void
}
