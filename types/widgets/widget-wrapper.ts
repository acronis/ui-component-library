import { UIKitComponent } from '../component'
import { VNode } from 'vue'

/** Widget Wrapper Slots */
export interface WidgetWrapperSlots {
  /** Content to the right of header */
  headerAside: VNode[],

  /** Content of footer */
  footer: VNode[],

  /** Content to the right of the footer */
  footerAside: VNode[],

  [key: string]: VNode[]
}

/** Widget Wrapper Component */
export declare class ElWidgetWrapper extends UIKitComponent {
  /* Height of widget wrapper */
  height: string

  /* Minimum height of widget wrapper */
  minHeight: string

  /* Toggle if header is present  */
  noHeader: boolean

  /* Toggle if spacing is present around content */
  noPadding: boolean

  /* Title of widget */
  title: string

  /* Subtitle of widget */
  subtitle: string

  $slots: WidgetWrapperSlots
}
