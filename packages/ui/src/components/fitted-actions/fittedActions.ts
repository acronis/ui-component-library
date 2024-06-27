export interface FittedActionsProps {
  /**
   * List of actions to display
   */
  actions?: FittedAction[]

  item?: FittedItem

  /**
   * Show the dropdown
   */
  showDropdown?: boolean
}

export interface FittedItem {
  id: string
  actionName: string
  isDivided: boolean
}

export interface FittedAction {
  id: string
  title: string
  actionName?: string
  isDivided?: boolean
  isInDropdown?: boolean
  display?: (item: FittedItem | undefined) => void | boolean
  name: string
}
