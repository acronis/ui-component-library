import { ElTable } from '../table';

export declare class ElDetailsTable extends ElTable {
  /** Table data */
  data: object[]

  /** Whether current row is highlighted */
  highlightCurrentRow: boolean

  /** whether details table is loading */
  loading: boolean

  /** Props of selection column */
  selectionColumnProps: object

  /** Clear selection. Might be useful when `reserve-selection` is on */
  clearSelection (): void

  /**
   * Set a certain row as selected
   *
   * @param row The row that is going to set as selected
   */
  setCurrentRow (row?: object): void
}
