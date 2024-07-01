export interface AcvCascaderProps {
  /**
   * Title of the Cascader
   */
  title?: string

  /**
   * Description of the Cascader
   */
  description?: string
}

export interface AcvCascaderEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvCascaderSlots {
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
