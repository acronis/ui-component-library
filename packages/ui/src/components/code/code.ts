export interface CodeProps {
  /**
   * Source code to display
   */
  code?: string

  /**
   * Extension of the source code
   */
  extension?: string
}

export interface CodeEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}
