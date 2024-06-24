import type { InjectionKey } from 'vue';

export type RowGridJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';
export type RowGridAlign = 'top' | 'middle' | 'bottom' | 'stretch';

export interface ColumnFlex {
  justify: RowGridJustify
  align: RowGridAlign
}

export interface RowInjection {
  flex: boolean | Partial<ColumnFlex>
  gap: number | number[]
}
export const ROW_KEY: InjectionKey<RowInjection> = Symbol('ROW_KEY');

export interface RowProps {
  /**
   * Grid spacing
   */
  gap?: number | number[]

  /**
   * Horizontal alignment of flex layout
   * @values 'start', 'end', 'center', 'space-around', 'space-between'
   * @defaultValue 'start'
   */
  justify?: RowGridJustify

  /**
   * Vertical alignment of flex layout
   * @values 'top', 'middle', 'bottom'
   * @defaultValue 'top'
   */
  align?: RowGridAlign

  /**
   * Custom tag
   * @defaultValue 'div'
   */
  tag?: string

  columnFlex?: boolean | Partial<ColumnFlex>
}

export interface RowSlots {
  /**
   * The default slot content
   */
  default: void
}
