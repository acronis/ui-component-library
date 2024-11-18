import type { AcvCellFlex } from '@/todo/cell/cell.ts';
import type { InjectionKey } from 'vue';

export type AcvLayoutProp = number | string | (number | string)[];

export type AcvGridJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

export type AcvGridAlign = 'top' | 'middle' | 'bottom' | 'stretch';

export interface GridInjection {
  cellFlex: AcvCellFlex | false
  columns: AcvLayoutProp
}

export const GRID_KEY: InjectionKey<GridInjection> = Symbol('GRID_KEY');

export interface AcvGridProps {
  /**
   * Tag of the grid container
   */
  tag?: string

  /**
   * Gap between the grid items
   */
  gap?: number | number[]

  /**
   * Number of rows in the grid
   */
  rows?: AcvLayoutProp

  /**
   * Number of columns in the grid
   */
  columns?: AcvLayoutProp

  /**
   * Number of columns in the grid
   */
  autoRows?: AcvLayoutProp

  /**
   * Number of columns in the grid
   */
  autoColumns?: AcvLayoutProp

  /**
   * Whether to use dense layout
   */
  dense?: boolean

  /**
   * Justify content of the grid
   */
  justify?: AcvGridJustify

  /**
   * Align content of the grid
   */
  align?: AcvGridAlign

  /**
   * Whether to use flex layout for the cell
   */
  cellFlex?: boolean | Partial<AcvCellFlex>
}
