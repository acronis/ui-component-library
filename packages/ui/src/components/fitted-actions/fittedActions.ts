export interface AcvFittedActionsProps {
  /**
   * List of actions to display
   */
  actions?: AcvFittedAction[]

  item?: AcvFittedItem

  /**
   * Show the dropdown
   */
  showDropdown?: boolean
}

export interface AcvFittedItem {
  id: string
  actionName: string
  isDivided: boolean
}

export interface AcvFittedAction {
  id: string
  title: string
  actionName?: string
  isDivided?: boolean
  isInDropdown?: boolean
  display?: (item: AcvFittedItem | undefined) => void | boolean
  name: string
}
