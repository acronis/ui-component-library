export interface AcvTypographyProps {
  /**
   * Typography title
   */
  title?: string

  /**
   * Typography subtitle
   */
  subtitle?: string

  /**
   * Typography text content
   */
  text?: string

  /**
   * Tag to use for title of the component
   * @defaultValue 'p'
   */
  titleTag?: string

  /**
   * Tag to use for subtitle of the component
   * @defaultValue 'p'
   */
  subtitleTag?: string

  /**
   * Tag to use for text rendered via `text` prop
   * @defaultValue 'p'
   */
  textTag?: string
}

export interface AcvTypographySlots {
  /**
   * Custom content for title
   */
  'title': (_: any) => null

  /**
   * Custom content for subtitle
   */
  'subtitle': (_: any) => null

  /**
   * Custom content on right side of title & subtitle.
   */
  'header-right': (_: any) => null

  /**
   * Custom content for text
   */
  'default': (_: any) => null
}
