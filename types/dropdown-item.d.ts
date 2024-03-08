import { UIKitComponent } from './component'

/** Toggleable menu for displaying lists of links and actions. */
export declare class ElDropdownItem extends UIKitComponent {
  /** A command to be dispatched to Dropdown's command callback */
  command: string | number | object

  /** Whether the item is disabled */
  disabled: boolean

  /** Whether the item is visible */
  visible: boolean

  /** Whether a divider is displayed */
  divided: boolean

  /** Name of the icon to show at the left of Menu Item */
  icon: string

  /** color of the icon on the left */
  iconColor: string
}
