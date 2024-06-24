import type { AcvFloatingProps, PopperPlacement } from '../popper/popper.ts';

export interface AcvDropdownProps extends AcvFloatingProps {
  /**
   * Whether the dropdown is disabled
   */
  disabled?: boolean
  search?: boolean
  placeholder?: PopperPlacement
  hideOnClick?: boolean
  hideOnScroll?: boolean
  value?: boolean
}

export interface AcvDropdownMenuProps {
  /**
   * Message to display when there is no data
   * @default 'No data available'
   */
  noDataMessage?: string

  /**
   * Show the arrow on the dropdown
   * @default false
   */
  showArrow?: boolean

  /**
   * Max height of the dropdown menu
   * @default 336
   */
  maxHeight?: number
}

export interface AcvDropdownMenuItemProps {
  command: string | number | object
  /**
   * Whether the item is disabled
   */
  disabled?: boolean
  /**
   * Show a divider above the item
   */
  divided?: boolean
  /**
   * The icon to display
   */
  icon?: string
  /**
   * The color of the icon
   * @default 'var(--color-text)'
   */
  iconColor?: string
}

export interface AcvDropdownEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void

  /**
   * Triggered when a dropdown item is clicked
   * @param eventName
   * @param command
   */
  (eventName: 'command', command: { item: any, action: () => void }): void
}

export interface AcvDropdownSlots {
  /**
   * Default slot for rendering trigger or anchor element
   * Usually you will use `AcvButton` component here
   */
  default: void

  /**
   * Slot for rendering dropdown content
   * Usually you will use `AcvList` component here
   */
  dropdown: void
}
