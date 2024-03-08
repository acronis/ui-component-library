import { ElTableColumn } from './table-column'
import { ElDropdownItem } from './dropdown-item'

/** TableActionsColumn Component */
export declare class ElTableActionsColumn extends ElTableColumn {
  /** Full name of header icon */
  headerIcon: string

  /** Full name of action icon **/
  actionIcon: string

  /** Whether to show the columns selector */
  showColumnsSelector: boolean

  /** Whether the columns selector is disabled */
  disableColumnsSelector: boolean

  /** Function to filter selectable columns */
  selectableColumnsFilter: (column: any) => boolean

  /** Array of action definitions to be passed to dropdown item */
  actions: ElDropdownItem[]

  /** Whether to hide the actions column when table rows are selected */
  hideOnRowSelection: boolean

  /** Array of columns' prop should be hidden initially */
  initialHiddenColumns: string[]
}
