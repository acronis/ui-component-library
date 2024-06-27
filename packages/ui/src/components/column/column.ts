export interface ColumnProps {
  /**
   * Number of columns
   * @values 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
   * @defaultValue 12
   */
  span?: number

  /**
   * Number of columns to offset
   * @defaultValue 0
   */
  offset?: number

  /**
   * Number of columns to push
   * @defaultValue 0
   */
  push?: number

  /**
   * Number of columns to pull
   * @defaultValue 0
   */
  pull?: number

  /**
   * Number of columns on extra-small screens
   */
  xs?: number

  /**
   * Number of columns on small screens
   */
  sm?: number

  /**
   * Number of columns on medium screens
   */
  md?: number

  /**
   * Number of columns on large screens
   */
  lg?: number

  /**
   * Number of columns on extra-large screens
   */
  xl?: number

  /**
   * Custom tag
   * @defaultValue 'div'
   */
  tag?: string

  /**
   * Row index
   */
  rowIndex?: number

  /**
   * Row span in grid layout
   */
  rowSpan?: number

  /**
   * Column index
   */
  colIndex?: number

  /**
   * Column span in grid layout
   */
  colSpan?: number
}

export interface ColumnEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface ColumnSlots {
  /**
   * The default slot content
   */
  default: void
  /**
   * The description slot content
   * @binding {string} description - The description prop value
   */
  description: void
}
