export interface AcvNotificationProps {
  /**
   * Title of the Notification
   */
  title?: string

  /**
   * Description of the Notification
   */
  description?: string
}

export interface AcvNotificationEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvNotificationSlots {
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
