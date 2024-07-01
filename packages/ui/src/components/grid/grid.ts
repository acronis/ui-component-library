import type { InjectionKey } from 'vue';
import type { CellFlex } from '../cell/cell.ts';

export type LayoutProp = number | string | (number | string)[];

export type GridJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';

export type GridAlign = 'top' | 'middle' | 'bottom' | 'stretch';

export interface GridInjection {
  cellFlex: CellFlex | false
  columns: LayoutProp
}

export const GRID_KEY: InjectionKey<GridInjection> = Symbol('GRID_KEY');

export interface GridProps {
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
  rows?: LayoutProp

  /**
   * Number of columns in the grid
   */
  columns?: LayoutProp

  /**
   * Number of columns in the grid
   */
  autoRows?: LayoutProp

  /**
   * Number of columns in the grid
   */
  autoColumns?: LayoutProp

  /**
   * Whether to use dense layout
   */
  dense?: boolean

  /**
   * Justify content of the grid
   */
  justify?: GridJustify

  /**
   * Align content of the grid
   */
  align?: GridAlign

  /**
   * Whether to use flex layout for the cell
   */
  cellFlex?: boolean | Partial<CellFlex>
}
