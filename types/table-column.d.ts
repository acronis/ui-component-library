import { CreateElement, VNode } from 'vue'
import { UIKitComponent, UIKitHorizontalAlignment } from './component'

export type TableColumnType = 'default' | 'selection' | 'index'
export type TableColumnFixedType = 'left' | 'right'

export type TableColumn = {
  /** Label of the column */
  label: string,

  /** Property name of the source data */
  property: string,

  /** Type of the column */
  type: string,

  /** Whether column is fixed at left/right */
  fixed: boolean | string
}

/** Data used in renderHeader function */
export interface RenderHeaderData {
  /** The column that is current rendering */
  column: any,

  /** The index of the rendering column */
  $index: number
}

/** TableColumn Component */
export declare class ElTableColumn extends UIKitComponent {
  /** Type of the column. If set to `selection`, the column will display checkbox. If set to `index`, the column will display index of the row (staring from 1). If set to `expand`, the column will display expand icon. */
  type: TableColumnType

  /** customize indices for each row, works on columns with `type=index` **/
  index: string | ((index: number) => number)

  /** Column label */
  label: string

  /** Column's key. If you need to use the filter-change event, you need this attribute to identify which column is being filtered */
  columnKey: string

  /** Field name. You can also use its alias: property */
  prop: string

  /** Column width */
  width: string

  /** Column minimum width. Columns with `width` has a fixed width, while columns with `min-width` has a width that is distributed in proportion */
  minWidth: string

  /** Whether column is fixed at left/right. Will be fixed at left if `true` */
  fixed: boolean | TableColumnFixedType

  /** Render function for table header of this column */
  renderHeader: (h: CreateElement, data: RenderHeaderData) => VNode | string

  /** Whether column can be sorted */
  sortable: boolean

  /** Whether column can be sorted */
  sortBy: string | string[]

  /** Sorting method. Works when `sortable` is `true` */
  sortMethod: (a: any, b: any) => number

  /** Whether column width can be resized. Works when border of `el-table` is `true` */
  resizable: boolean

  /** Function that formats content */
  formatter: (row: object, column: TableColumn) => any

  /** whether show browser native hint when hovering on the cell */
  showHint: boolean

  /** Whether to hide extra content and show them in a tooltip when hovering on the cell */
  showOverflowTooltip: boolean

  /** whether Table Column has vertical border */
  border: boolean

  /** position of the vertical border */
  borderPosition: string

  /** Alignment */
  align: UIKitHorizontalAlignment

  /** Alignment of the table header. If omitted, the value of the `align` attribute will be applied */
  headerAlign: UIKitHorizontalAlignment

  /** Class name of cells in the column */
  className: string

  /** Class name of the label of this column */
  labelClassName: string

  /** Function that determines if a certain row can be selected, works when `type` is `'selection'` */
  selectable: (row: object, index: number) => boolean

  /** Function that determines if a certain cell can be click */
  clickable: (row: object, index: number) => boolean

  /** Whether to reserve selection based on the rowKey after data refreshing, works when `type` is 'selection' and table `row-key` is set */
  reserveSelection: boolean

  /** whether all the rows are selected by default, works when `type` is 'selection' */
  defaultSelectAll: boolean

  /** whether the table column is hidden */
  hidden: boolean

  /** Hide the cell's content in the column but keep the column rendered */
  hideCellContent: boolean

  /** whether minWidth of table column is set by header cell content width */
  autoWidth: boolean
}
