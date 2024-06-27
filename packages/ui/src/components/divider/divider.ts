export type DividerTextPosition = 'center' | 'left' | 'right';

export interface DividerProps {
  /**
   * Orientation of the Divider
   */
  vertical?: boolean

  /**
   * Position of the text in the Divider
   */
  textPosition?: DividerTextPosition

  /**
   * Margin of the Divider
   */
  margin?: string | number

  /**
   * Color of the Divider
   * @defaultValue 'brand'
   * @values 'brand', 'accent', 'neutral', 'success', 'warning', 'danger', 'info'
   */
  color?: 'brand' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}
