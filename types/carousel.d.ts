import { UIKitComponent } from './component'
import { VNode } from 'vue'

export type ArrowDisplayType = 'always' | 'hover' | 'never'
export type IndicatorDisplayType = 'always' | 'hover' | 'never'
export type IndicatorTriggerType = 'click' | 'hover'

export interface CarouselSlots {
  /** Content of Carousel */
  default: VNode[],

  /** Contents of backward navigation arrow */
  navArrowBackward: VNode[]

  /** Contents of forward navigation arrow */
  navArrowForward: VNode[]

  [key: string]: VNode[]
}

/** Carousel component */
export declare class ElCarousel extends UIKitComponent {
  /** Whether Carousel plays automatically */
  autoplay: boolean

  /** Height of Carousel in pixels */
  height: number

  /** Index to start Carousel from */
  initialIndex: number

  /** Interval when `autoplay` is `true` in milliseconds */
  interval: number

  /** Type of display for navigation arrows */
  navigationArrows: ArrowDisplayType

  /** Number of slides to display */
  slideCount: number

  /** Type of display for slide indicators */
  slideIndicators: IndicatorDisplayType

  /** Width between slides in pixels */
  spaceWidth: number

  /** Type of trigger applied to indicators */
  triggerType: IndicatorTriggerType

  /** Width of Carousel in pixels */
  width: number

  $slots: CarouselSlots
  
  /**
   * Switches to the next slide
   */
  next(): void

  /**
  * Switches to the previous slide
  */
  prev(): void

  /**
   * Switches to the slide defined by parameter
   *
   * @param slide Index or name of slide to be switched to
   */
   setActiveItem(slide: number | string): void
}
