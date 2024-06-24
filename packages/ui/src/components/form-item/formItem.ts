export interface AcvFormItemProps {
  /**
   * Title of the FormItem
   */
  title?: string

  /**
   * Description of the FormItem
   */
  description?: string
}

export interface AcvFormItemEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvFormItemSlots {
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
