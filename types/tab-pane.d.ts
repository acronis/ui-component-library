import { UIKitComponent } from './component'

/** Tab Pane Component */
export declare class ElTabPane extends UIKitComponent {
  /** Title of the tab */
  label: string

  /** Whether Tab is disabled */
  disabled: boolean

  /** Identifier corresponding to the activeName of Tabs, representing the alias of the tab-pane */
  name: string
}
