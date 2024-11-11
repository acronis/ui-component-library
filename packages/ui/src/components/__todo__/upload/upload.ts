export interface AcvUploadProps {
  /**
   * Title of the Upload
   */
  title?: string

  /**
   * Description of the Upload
   */
  description?: string
}

export interface AcvUploadEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvUploadSlots {
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
