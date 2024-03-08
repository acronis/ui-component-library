import { UIKitComponent } from '../component'
import { VNode } from 'vue'

export interface ElItemProperties {
  title?: string

  icon?: string

  right?: boolean

  action?: Function | string

  route?: boolean

  iconUrl?: string
}

export interface HeaderMenuSlots {
  /** content of the title */
  title: VNode[]

  [key: string]: VNode[]
}

/** Header Component */
export declare class ElHeaderMenu extends UIKitComponent {
  /* Array of menu item object */
  items: ElItemProperties[]

  /* icon name */
  icon: string

  /* text display as first item in dropdown */
  title: string

  /* allow fixed width */
  width: string

  /* support larger menu */
  isLarge: boolean

  /* text of browser default tooltip for the headerMenu */
  tooltipText: string

  $slots: HeaderMenuSlots
}
