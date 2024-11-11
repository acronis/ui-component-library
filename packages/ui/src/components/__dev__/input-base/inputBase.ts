export interface AcvInputBaseProps {
  /**
   * The value of the InputBase
   */
  modelValue: string | number | boolean | object | Array<any>

  /**
   * Type of the InputBase
   */
  type?: string

  /**
   * Whether the InputBase is hidden
   */
  hidden?: boolean
}

export interface AcvInputBaseEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}
