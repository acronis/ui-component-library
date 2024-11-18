export interface AcvTilesProps {
  /**
   * Title of the Tiles
   */
  title?: string

  /**
   * Description of the Tiles
   */
  description?: string
}

export interface AcvTilesEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvTilesSlots {
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
