import { UIKitComponent } from '../component'
import { VNode } from 'vue'

export interface DetailsSlots {
  /** panel header */
  header: VNode[],

  /** panel toolbar */
  toolbar: VNode[],

  /** panel table */
  table: VNode[],

  /** details view */
  details: VNode[]

  [key: string]: VNode[]
}

/** Details Component */
export declare class ElDetails extends UIKitComponent {
  /* details selection mode */
  mode: string

  /** whether details panel are open */
  open: boolean

  $slots: DetailsSlots
}
