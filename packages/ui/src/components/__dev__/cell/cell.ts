export interface AcvCellFlex {
  justify: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
  align: 'top' | 'middle' | 'bottom' | 'stretch'
}

export interface AcvCellOptions {
  top?: number | string
  left?: number | string
  width?: number
  height?: number
  right?: number | string
  bottom?: number | string
}

export interface AcvCellProps {
  /**
   * Tag of the cell container
   */
  tag?: string

  /**
   * Top position of the cell
   */
  top?: number | string

  /**
   * Left position of the cell
   */
  left?: number | string

  /**
   * Width of the cell
   */
  width?: number | null

  /**
   * Height of the cell
   */
  height?: number

  /**
   * Right position of the cell
   */
  right?: number | string

  /**
   * Bottom position of the cell
   */
  bottom?: number | string

  /**
   * Cell options for different screen sizes
   */
  xs?: AcvCellOptions | number | null
  sm?: AcvCellOptions | number | null
  md?: AcvCellOptions | number | null
  lg?: AcvCellOptions | number | null
  xl?: AcvCellOptions | number | null
  xxl?: AcvCellOptions | number | null

  /**
   * Whether to use flex layout for the cell
   */
  useFlex?: boolean | Partial<AcvCellFlex> | null

  inherit?: boolean
}
