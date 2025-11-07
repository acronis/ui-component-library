export type AcvAsideAnchor = 'left' | 'right' | 'top' | 'bottom';
export type AcvAsidePosition = 'static' | 'fixed' | 'sticky' | 'absolute';

export interface AcvAsideProps {
  /**
   * Size of the Aside: controls the cross-axis dimension (width for left/right anchor, height for top/bottom anchor)
   */
  size?: string

  /**
   * Background color of the Aside
   * @values transparent, primary, secondary, success, warning, danger, info, light, dark
   */
  color?: string

  /**
   * Aside visibility state
   */
  modelValue?: boolean

  /**
   * Aside anchor/position relative to main content
   * @defaultValue 'left'
   */
  anchor?: AcvAsideAnchor

  /**
   * CSS position type
   * @defaultValue 'static'
   */
  position?: AcvAsidePosition

  /**
   * Whether the aside can be collapsed/expanded
   * @defaultValue false
   */
  collapsible?: boolean

  /**
   * Persistence of aside when clicked outside of reference element
   */
  persistent?: boolean

  /**
   * Whether to show shadow/elevation effect
   * @defaultValue false
   */
  elevation?: boolean

  /**
   * Custom CSS classes to apply
   */
  customClass?: string

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string

  /**
   * ARIA labelledby for accessibility
   */
  ariaLabelledby?: string

  /**
   * Whether animations are enabled
   * @defaultValue true
   */
  animated?: boolean

  /**
   * Whether the aside is responsive (hides on small screens)
   * @defaultValue true
   */
  responsive?: boolean
}

export interface AcvAsideEvents {
  /**
   * Triggered when the aside visibility state changes
   * @arg {string} eventName - The name of the event
   * @arg {boolean} visible - The visibility state of the component
   */
  (eventName: 'update:modelValue', visible: boolean): void

  /**
   * Triggered when the aside is opened
   * @arg {string} eventName - The name of the event
   */
  (eventName: 'open'): void

  /**
   * Triggered when the aside is closed
   * @arg {string} eventName - The name of the event
   */
  (eventName: 'close'): void

  /**
   * Triggered when the aside is toggled
   * @arg {string} eventName - The name of the event
   * @arg {boolean} visible - The new visibility state
   */
  (eventName: 'toggle', visible: boolean): void
}

export interface AcvAsideSlots {
  /**
   * Default slot for main content
   */
  default?: () => any

  /**
   * Header slot for aside header content
   */
  header?: () => any

  /**
   * Footer slot for aside footer content
   */
  footer?: () => any
}
