import { UIKitComponent } from './component'

/** Table data cell Component */
export declare class ElTd extends UIKitComponent {

  /** Table column config */
  column: string

  /** Internal table component store */
  store: string

  /** Whether table cell is in last table row */
  inLastRow: boolean
}
