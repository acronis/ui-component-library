export interface AcvThemeProviderProps {
  /**
   * Specify custom tag used on a root element
   * @defaultValue div
   */
  tag?: string

  /**
   * Specify the theme to apply
   */
  theme?: string

  /**
   * Apply selected theme background color
   */
  withBackground?: boolean
}

export interface AcvThemeProviderSlots {
  /**
   * All children elements will have the theme applied
   * must be a single root element
   */
  default: void
}
