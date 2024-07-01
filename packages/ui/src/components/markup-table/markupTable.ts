export interface MarkupTableColumn {
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

export interface MarkupTableProps {
  /**
   * Table columns
   */
  columns?: MarkupTableColumn[]
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
