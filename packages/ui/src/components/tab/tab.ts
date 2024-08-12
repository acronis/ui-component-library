export interface AcvTabProps {
  /**
   * Tab label
   */
  label?: string

  /**
   * Tab icon
   */
  icon?: string
  /**
   * Tab key
   * identifier corresponding to the activeName of Tabs, representing the alias of the tab-pane
   * ordinal number of the tab-pane in the sequence, e.g. the first tab-pane is '1'
   */
  value?: number | string
  /**
   * Whether the tab is disabled
   * @default false
   */
  disabled?: boolean
  /**
   * Whether the tab is closable
   */
  closable?: boolean
}

export interface AcvTabSlots {
  /**
   * Prepend content to the title
   */
  prepend: () => any

  /**
   * Append content to the title
   */
  append: () => any
}
