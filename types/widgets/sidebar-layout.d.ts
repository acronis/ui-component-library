import { UIKitComponent } from '../component'
import { VNode } from 'vue'

export interface SidebarLayoutSlots {
  /** left side panel slots */
  panel: VNode[]

  /** right side sidebar which controlled by open attribute */
  sidebar: VNode[]

  [key: string]: VNode[]
}

/** Sidebar layout Component */
export declare class ElSidebarLayout extends UIKitComponent {
  /** Whether sidebar panel are open */
  open: boolean

  $slots: SidebarLayoutSlots
}
