export interface HeaderProps {
  /**
   * Bottom border of the Header
   * @defaultValue true
   */
  bordered?: boolean

  /**
   * Height of the Header
   * @defaultValue 64px
   */
  height?: string

  /**
   * Background color of the Header
   * @values transparent, primary, secondary, success, warning, danger, info, light, dark
   * @defaultValue white
   */
  color?: 'brand' | 'white' | 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'accent' | 'danger' | 'critical' | 'warning' | 'success' | 'info'

  /**
   * Title of the Header
   */
  title?: string

  /**
   * Align the title
   * @values left, center, right
   * @defaultValue center
   */
  align?: string
}

export interface HeaderSlots {
  /**
   * The default slot content
   */
  default: void
  /**
   * Used to pass a custom aside content
   */
  aside: void

  actions: void
}
