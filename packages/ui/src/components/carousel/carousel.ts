export interface CarouselProps {
  /**
   * Title of the Carousel
   */
  title?: string

  /**
   * Description of the Carousel
   */
  description?: string
}

export interface CarouselEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface CarouselSlots {
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
