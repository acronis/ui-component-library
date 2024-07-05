export interface AcvTabsProps {
  /**
   * Title of the Tabs
   */
  title?: string

  /**
   * Description of the Tabs
   */
  description?: string
}

export interface AcvTabProps {}

export interface AcvTabsEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvTabsSlots {
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
