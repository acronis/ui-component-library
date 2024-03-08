import { UIKitComponent } from './component'

export type Size = 'default' | 'compact' | 'medium'

export type Color = 'solid-brand-lightest' | 'solid-brand-accent' | 'fixed-white'

export type SortOrder = 'ascending' | 'descending'

/** Options to set the default sort column and order */
export interface DefaultSortOptions {
  /** Default sort column */
  prop: string,

  /** Default sort order */
  order: SortOrder
}

export interface CustomIconsSetting {
  ascSort?: string;
  descSort?: string;
  expand?: string;
  collapse?: string;
}

/** Table Component */
export declare class ElTable extends UIKitComponent {
  /** allow disabled selection ids retained */
  allowDisabledSelection: boolean
  /** Background color */
  backgroundColor: Color

  /** Whether table has bottom border */
  borderBottom: boolean

  /** Whether table has horizontal border */
  borderHorizontal: boolean

  /** Whether table has top border */
  borderTop: boolean

  /** Whether table has vertical border */
  borderVertical: boolean

  /** Function that returns custom class names for a cell, or a string assigning class names for every cell */
  cellClassName: string | ((row: object, index: number) => string)

  /** Function that returns custom style for a cell, or a string assigning custom style for every cell */
  cellStyle: object | ((row: object, index: number) => object)

  cols: object[]

  /** Whether columns are reorderable. Works only with tables with no column groups. */
  colReorderable: boolean

  /** Key of current row, a set only prop */
  currentRowKey: string | number

  /** Set icons to customize their using in different parts of a table */
  customIcons: CustomIconsSetting

  /** Table data */
  data: object[]

  /** Set the default sort column and order */
  defaultSort: DefaultSortOptions

  /** Displayed text when data is empty. You can customize this area with `slot="empty"` */
  emptyText: string

  /** Whether width of column automatically fits its container */
  fit: boolean

  /** Function that returns custom class names for a header cell, or a string assigning class names for every header cell */
  headerCellClassName: string | ((row: object, index: number) => string)

  /** Function that returns custom style for a header cell, or a string assigning custom style for every header cell */
  headerCellStyle: object | ((row: object, index: number) => object)

  /** Function that returns custom class names for a header row, or a string assigning class names for every header row */
  headerRowClassName: string | ((row: object, index: number) => string)

  /** Function that returns custom style for a header row, or a string assigning custom style for every header row */
  headerRowStyle: object | ((row: object, index: number) => object)

  /** Table's height. By default it has an auto height. If its value is a number, the height is measured in pixels; if its value is a string, the height is affected by external styles */
  height: string | number

  /** Whether current row is highlighted */
  highlightCurrentRow: boolean

  /** Apply selection logic to the table */
  isSelectable: boolean

  /** Table's max-height. The height of the table starts from auto until it reaches the maxHeight limit. The maxHeight is measured in pixels, same as height */
  maxHeight: string | number

  /** Set the multi-selection mode as the default, works when `is-selectable` is set */
  multiSelectionMode: boolean

  /** Function that returns custom class names for a row, or a string assigning class names for every row */
  rowClassName: string | ((row: object, index: number) => string)

  /** Key of row data, used for optimizing rendering. Required if reserve-selection or reserve-highlight is on */
  rowKey: (row: object) => any

  /** Function that returns custom style for a row, or a string assigning custom style for every row */
  rowStyle: string | object | ((row: object, index: number) => object)

  rowTooltipText: string | ((row: object, index: number) => string)

  selectByRow: boolean

  /** Set selection by ids defined in table `row-key` */
  selectedIds: object[]

  /** Whether table header is visible */
  showHeader: boolean

  /** Size of Table  */
  size: Size

  /** Enables skeleton screen */
  skeleton: boolean

  /** Whether table is striped */
  stripe: boolean

  /** The rows limit to enable virtual rendering */
  virtualRenderLimit: number

  virtualScroll: boolean

  virtualScrollRenderTimeout: boolean | number

  /** Clear selection. Might be useful when `reserve-selection` is on */
  clearSelection (): void

  /** Clear sorting, restore data to the original order **/
  clearSort (): void

  /** Refresh the layout of Table.
   * When the visibility of Table changes, you may need to call this method to get a correct layout
   */
  doLayout (): void

  /**
   * Set a certain row as selected
   *
   * @param row The row that is going to set as selected
   */
  setCurrentRow (row?: object): void

  /**
   * Toggle or set if a certain row is selected
   *
   * @param row The row that is going to set its selected state
   * @param selected Whether the row is selected. The selected state will be toggled if not set
   */
  toggleRowSelection (row: object, selected?: boolean): void
}
