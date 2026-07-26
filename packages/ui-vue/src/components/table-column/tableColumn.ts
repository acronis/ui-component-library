export interface AcvTableColumnProps {
  /**
   * Title of the TableColumn
   */
  title?: string

  /**
   * Description of the TableColumn
   */
  description?: string
}

export interface AcvTableColumnEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvTableColumnSlots {
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
