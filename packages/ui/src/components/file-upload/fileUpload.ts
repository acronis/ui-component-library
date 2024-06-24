export interface AcvFileUploadProps {
  /**
   * Title of the FileUpload
   */
  title?: string

  /**
   * Description of the FileUpload
   */
  description?: string
}

export interface AcvFileUploadEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvFileUploadSlots {
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
