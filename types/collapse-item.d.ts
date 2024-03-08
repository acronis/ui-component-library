import { VNode } from 'vue'
import { UIKitComponent } from './component'

export interface CollapseItemSlots {
  /** Content of the collapse item */
  default: VNode[],

  /** Title of the collapse item */
  title: VNode[]

  [key: string]: VNode[]
}

/** Collapse Item Component */
export declare class ElCollapseItem extends UIKitComponent {
  /** custom icon instead arrow */
  icon: boolean

  /** place arrow on the left of the title */
  leftArrow: boolean

  /** Unique identification of the panel */
  name: string | number

  /** Make title and content background colors transparent */
  noBackground: boolean

  /* Set zero paddings on the header */
  noPadding: boolean

  /** Not display border between title and content */
  noBorder: boolean

  /** Title of the panel */
  title: string

  /** Hide/show arrow button */
  withoutArrow: boolean

  /** click whole title area to collapse/expand */
  clickTitleToCollapse: boolean

  /** whether the collapse item is disabled */
  disabled: boolean

  /** Set background-color of the title */
  titleBackgroundColor: string

  /** Set background-color of the panel */
  panelBackgroundColor: string

  $slots: CollapseItemSlots
}
