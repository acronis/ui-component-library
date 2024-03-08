import { UIKitComponent } from './component'

export type MenuDisplayMode = 'horizontal' | 'vertical'
export type MenuType = 'primary' | 'secondary' | 'tertiary'
export type MenuTheme = 'light' | 'dark'

/** Menu that provides navigation for your website */
export declare class ElMenu extends UIKitComponent {
  /** Menu display mode */
  mode: MenuDisplayMode

  /** Whether the menu is collapsed (available only in vertical mode) */
  collapse: boolean

  /** Menu type */
  type: MenuType

  /** Binding index of currently active menu */
  value: string

  /** Index of default active menu */
  defaultActive: string

  /** Array that contains keys of currently active sub-menus */
  defaultOpeneds: string[]

  /** Whether only one sub-menu can be active */
  uniqueOpened: boolean

  /** Whether vue-router mode is activated. If true, index will be used as 'path' to activate the route action */
  router: boolean

  /** Background color of the menu */
  background: string

  /** Whether automatically scroll into newly expanded submenu */
  scrollIntoExpanded: boolean
}
