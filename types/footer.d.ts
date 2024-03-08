import { UIKitComponent } from './component'
import { VNode } from 'vue'

/** Footer Component */
export interface FooterSlots {
  /** Content of the Footer */
  default: VNode[];

  /** Content of the Footer aside */
  aside: VNode[];

  [key: string]: VNode[]
}

export declare class ElFooter extends UIKitComponent {
  /** Height of the footer */
  height: string

  /** Background-color of the footer */
  color: string
}
