export interface AcvCounterProps {
  /**
   * Count value
   */
  count?: string | number
}

export interface AcvCounterEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvCounterSlots {
  /**
   * The default slot content
   */
  default: void
}
