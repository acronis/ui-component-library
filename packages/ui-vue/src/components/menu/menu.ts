import type { InjectionKey, Ref } from 'vue';

export interface AcvMenuProps {
  /**
   * Type of the Menu
   * @default 'primary'
   * @values 'primary', 'secondary', 'tertiary'
   */
  type?: 'primary' | 'secondary' | 'tertiary'

  /**
   * Selected menu item
   */
  modelValue?: string | number

  /**
   * Menu items
   */
  defaultActive?: string

  /**
   * Menu items
   */
  defaultOpened?: string[]

  /**
   * Whether the Menu is collapsible
   * @default false
   */
  collapse?: boolean

  /**
   * Whether the Menu is expandable
   * @default false
   */
  scrollIntoExpand?: boolean

  /**
   * Whether unique opened items are enabled
   * @default true
   */
  uniqueOpened?: boolean

  /**
   * Whether the router is enabled
   * @default false
   */
  router?: boolean

  /**
   * Background color
   * @values 'primary', 'secondary', 'tertiary', 'nav-primary'
   */
  background?: string

  /**
   * Whether bottom border is hidden
   */
  hideBottomBorder?: boolean

  /**
   * Whether borders are hidden
   */
  hideBorders?: boolean

  /**
   * Height of the Menu
   */
  height?: string
}

export interface AcvMenuEvents {
  /**
   * Triggered when the selected menu item changes
   * @arg {string} eventName - The name of the event
   * @arg {string} item - The selected menu item
   */
  (eventName: 'update:modelValue', item: string | number): void

  (eventName: 'select', item: string): void

  (eventName: 'open', item: string): void

  (eventName: 'close', item: string): void
}

export interface AcvMenuInjection {
  menuProps?: AcvMenuProps
  selectedItem?: Ref<string>
  selectItem?: (item: string | number) => void
}

const MENU_KEY = Symbol('MENU_KEY') as InjectionKey<AcvMenuInjection>;

export interface AcvMenuSlots {
  prepend?: () => any
  append?: () => any
  default: () => any
}

export { MENU_KEY };
