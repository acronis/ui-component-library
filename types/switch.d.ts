import { UIKitComponent } from './component'

/** Switch Component */
export declare class ElSwitch extends UIKitComponent {
  /** Input name of Switch */
  name: string

  /** Whether Switch is on */
  value: boolean

  /** Switch value when in on state */
  activeValue: string | boolean | number

  /** Switch value when in off state */
  inactiveValue: string | boolean | number

  /** Whether Switch is disabled */
  disabled: boolean

  /** Swap icon and label */
  reverse: boolean

  /** whether to show browser default hint when hover */
  showHoverHint: boolean
}
