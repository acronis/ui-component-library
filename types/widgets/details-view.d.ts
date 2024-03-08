import { UIKitComponent } from '../component'
import { VNode } from 'vue'

export interface DetailsViewSlots {
  /** view header */
  header: VNode[],

  /** view toolbar */
  toolbar: VNode[],

  /** view content */
  content: VNode[]

  [key: string]: VNode[]
}

/** Details panel for the details widget */
export declare class ElDetailsView extends UIKitComponent {
  /** title of details view header */
  title: string

  $slots: DetailsViewSlots
}
