import { UIKitComponent } from './component'

import { VNode } from 'vue'

export interface MenuItemSlots {
  /** Icon on the left */
  icon: VNode[],

  /** Icon on the right */
  rightIcon: VNode[],

  /** Subtitle of menu item */
  subtitle: VNode[],

  /** Title of menu item */
  title: VNode[],

  [key: string]: VNode[]
}

/** Menu Item Component */
export declare class ElMenuItem extends UIKitComponent {
  /** Whether menu item is disabled */
  disabled: boolean

  /** When true, will only match if the path matches the location.pathname exactly */
  exact: boolean

  /** Unique identification */
  index: string

  multiline: boolean

  /** Number of lines to show when mulitline is true */
  multilineLimit: number

  /** Vue Router object */
  route: object

  /** whether to show browser default hint when hover */
  showHoverHint: boolean


  $slots: MenuItemSlots
}
