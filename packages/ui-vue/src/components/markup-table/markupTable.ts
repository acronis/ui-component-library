export interface AcvMarkupTableColumn {
  /**
   * Column key
   */
  key: string
  /**
   * Column title
   */
  title: string
  /**
   * Column width
   */
  width?: string
  /**
   * Column max width
   */
  maxWidth?: string
  /**
   * Column align
   * @values left, center, right
   */
  align?: string
  /**
   * Column render
   */
  render?: (data: any, index: number) => any

  fixed?: 'left' | 'right'

  resizable?: boolean
}

export interface AcvMarkupTableProps {
  /**
   * Table columns
   */
  columns?: AcvMarkupTableColumn[]
  /**
   * Table data
   */
  data?: any[]
  /**
   * Whether table is bordered
   * @values true, false
   */
  bordered?: boolean
  /**
   * Whether table is compact
   */
  dense?: boolean
  height?: number
}
