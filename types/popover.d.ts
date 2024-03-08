import { VNode, VNodeDirective } from 'vue'
import { UIKitComponent } from './component'

export type PopoverTrigger = 'click' | 'focus' | 'hover' | 'manual'
export type PopoverPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'

export interface PopoverSlots {
  /** Content of popover */
  default: VNode[],

  /** HTML element that triggers popover */
  reference: VNode[]

  [key: string]: VNode[]
}

/** Popover directive definition */
export interface ElPopoverDirective extends VNodeDirective {
  name: 'popover',
  arg: string
}

/** Popover Component */
export declare class ElPopover extends UIKitComponent {
  /** How the popover is triggered */
  trigger: PopoverTrigger

  /** Popover width */
  width: string | number

  /** Popover placement */
  placement: PopoverPlacement

  /** Whether Popover is disabled */
  disabled: boolean

  /** Turn on loading behavior */
  loading: boolean

  /** Whether popover is visible */
  value: boolean

  /** Popover offset */
  offset: number

  /** Popover transition animation */
  transition: string

  /** popover pointer */
  pointer: string

  /** Parameters for popper.js */
  popperOptions: object

  /** Custom class name for popover */
  popperClass: string

  /** Delay of appearance when trigger is hover, in milliseconds */
  openDelay: number

  $slots: PopoverSlots
}
