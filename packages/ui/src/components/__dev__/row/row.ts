import type { InjectionKey } from 'vue';

export type AcvRowGridJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly';
export type AcvRowGridAlign = 'top' | 'middle' | 'bottom' | 'stretch';

export interface AcvColumnFlex {
  justify: AcvRowGridJustify
  align: AcvRowGridAlign
}

export interface AcvRowInjection {
  flex: boolean | Partial<AcvColumnFlex>
  gap: number | number[]
}
export const ROW_KEY: InjectionKey<AcvRowInjection> = Symbol('ROW_KEY');

export interface AcvRowProps {
  /**
   * Grid spacing
   */
  gap?: number | number[]

  /**
   * Horizontal alignment of flex layout
   * @values 'start', 'end', 'center', 'space-around', 'space-between'
   * @defaultValue 'start'
   */
  justify?: AcvRowGridJustify

  /**
   * Vertical alignment of flex layout
   * @values 'top', 'middle', 'bottom'
   * @defaultValue 'top'
   */
  align?: AcvRowGridAlign

  /**
   * Custom tag
   * @defaultValue 'div'
   */
  tag?: string

  columnFlex?: boolean | Partial<AcvColumnFlex>
}

export interface AcvRowSlots {
  /**
   * The default slot content
   */
  default: void
}
