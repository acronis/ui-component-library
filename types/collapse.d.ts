import { UIKitComponent } from './component'

/** Use Collapse to store contents. */
export declare class ElCollapse extends UIKitComponent {
  /** Currently active panel */
  value: string | number | string[] | number[]

  /** The header's height */
  size: 'small' | 'large' | 'auto'

  /** Whether to activate accordion mode */
  accordion: boolean

  /** Whether to expand all items by default */
  defaultExpanded: boolean
}
