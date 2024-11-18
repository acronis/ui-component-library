export interface AcvConfirmDialogProps {
  /**
   * Title of the ConfirmDialog
   */
  title?: string

  /**
   * Description of the ConfirmDialog
   */
  description?: string
}

export interface AcvConfirmDialogEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void

  /**
   * Triggered when the confirm button is clicked
   * @param eventName
   */
  (eventName: 'confirm'): void
}

export interface AcvConfirmDialogSlots {
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
