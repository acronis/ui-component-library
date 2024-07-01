export interface AcvFileBrowserProps {
  /**
   * Title of the FileBrowser
   */
  title?: string

  /**
   * Description of the FileBrowser
   */
  description?: string
}

export interface AcvFileBrowserEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvFileBrowserSlots {
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
