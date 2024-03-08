import { UIKitComponent } from '../component'
import { VNode } from 'vue'

export interface SidebarPanelSlots {
  /** sidebar preview */
  preview: VNode[]

  /** item properties */
  properties: VNode[]

  /** sidebar actions */
  actions: VNode[]

  [key: string]: VNode[]
}

export interface SidebarPanelAction {
  /** action type */
  type: string

  /** whether have divider */
  divider: boolean

  /** label of the action */
  label: string

  /** icon of the action */
  icon: boolean

  /** whether have divider */
  command: string | symbol

  /** array of action object used for 'action-group' type */
  subActions?: SidebarPanelAction[]
}

export interface SidebarPanelProperty {
  /** property label */
  label: string,

  /** property value */
  value: string
}

/** Sidebar Panel Component */
export declare class ElSidebarPanel extends UIKitComponent {
  /** the title of the item */
  title: string

  /** the subtitle of the item */
  subtitle: string

  /** the properties of the item, which is an array of { label, value } object. */
  properties: SidebarPanelProperty[]

  /** the actions of the item */
  actions: SidebarPanelAction[]

  /** whether to show the close icon */
  showClose: boolean

  $slots: SidebarPanelSlots
}
