import { UIKitComponent } from './component'
import { PopoverPlacement } from './popover'

/** Tooltip Component */
export declare class ElTooltip extends UIKitComponent {

  /** Display content, can be overridden by slot#content */
  content: string

  /** Position of Tooltip */
  placement: PopoverPlacement

  /** Visibility of Tooltip */
  value: boolean

  /** Whether Tooltip is disabled */
  disabled: boolean

  /** Offset of the Tooltip */
  offset: number

  /** Animation name */
  transition: string

  /** Whether an arrow is displayed. For more information, check Vue-popper page */
  visibleArrow: boolean

  /** Popper.js parameters */
  popperOptions: object

  /** Delay of appearance, in millisecond */
  openDelay: number

  /** Whether to control Tooltip manually. mouseenter and mouseleave won't have effects if set to true */
  manual: boolean

  /** Custom class name for Tooltip's popper */
  popperClass: string

  /** Whether the mouse can enter the tooltip	 */
  enterable: string

  /** Timeout in milliseconds to hide tooltip */
  hideAfter: string

  /** Max width */
  maxWidth: 'default' | 'auto-width' | number
}
