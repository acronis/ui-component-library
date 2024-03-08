import {UIKitComponent} from "./component";

export type ActionElementType = 'button' | 'iconbutton' | 'dropdown'

export interface Action {
  /** Whether action is rendered */
  display: boolean,

  /** Whether action is disabled */
  disabled: boolean,

  /** Action label */
  label: string,

  /** Action icon */
  icon: string,

  /** Action command */
  command: string,

  /** Action render component */
  component: object,

  /** Action trigger callback */
  action: () => void | Promise<any>
}

/** TableActionItem Component */
export declare class ElTableActionItem extends UIKitComponent {
  /** Detailed item or table row data **/
  item: object

  /** Action configuration **/
  action: Action

  /** Type of action element */
  type: ActionElementType

  /** Whether action is divided */
  divided: boolean

  /** Label of action */
  label: string

  /** Vue component to represent table item action */
  component: object

  /** Type of action element button */
  buttonType: string

  /** ID for test purposes */
  testID: string
}
