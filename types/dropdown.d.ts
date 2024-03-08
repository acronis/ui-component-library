import { UIKitComponent, UIKitComponentSize } from './component'
import { ButtonType } from './button'

export type DropdownMenuAlignment = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'
export type DropdownMenuTrigger = 'hover' | 'click'

/** Toggleable menu for displaying lists of links and actions */
export declare class ElDropdown extends UIKitComponent {
  /** Menu button type. only works when split-button is true */
  type: ButtonType

  /** Whether a button group is displayed */
  splitButton: boolean

  /** Whether a search is displayed */
  search: boolean

  /** menu size, also works on the split button */
  size: UIKitComponentSize

  /** Placement of the menu */
  placement: DropdownMenuAlignment

  /** How to trigger */
  trigger: DropdownMenuTrigger

  /** Whether to hide menu after clicking menu-item */
  hideOnClick: boolean

  /** Close dropdown when scroll the window */
  hideOnScroll: boolean

  /** Whether a button group is displayed disabled */
  disabled: boolean
}
