/** Tab Pane Component */
export interface AcvTabPaneProps {
  /** Title of the tab */
  label?: string

  /** Whether Tab is disabled */
  disabled?: boolean

  /** Identifier corresponding to the activeName of Tabs, representing the alias of the tab-pane */
  name: string
}

export interface AcvTabPaneSlots {
  default: () => any

  icon: () => any

  label: () => any
}
