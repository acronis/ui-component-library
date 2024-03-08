import { UIKitComponent } from '../component'

/** Table Widget Item */
export interface TableWidgetItem {
  /** Data points */
  points: object[],

  /** Columns of table */
  columns: object[],

  /** Columns to be hidden initially */
  initialHiddenColumns: string[],
}

/** Table Widget Component */
export declare class ElTableWidget extends UIKitComponent {
  /* Table Widget data */
  data: TableWidgetItem[]

  /* Key of row data. Refer to row-key attribute in Table component. */
  rowKey: string

  /* Title of table */
  title: string
}
