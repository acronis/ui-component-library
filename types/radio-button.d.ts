import { UIKitComponent } from './component'

/** Radio Button Component */
export declare class ElRadioButton extends UIKitComponent {
  /** The form input value */
  value: string

  /** The value of radio */
  label: string | number

  /** Whether radio is disabled */
  disabled: boolean

  /** Native 'name' attribute */
  name: string

  /** whether to show browser default hint when hover */
  showHoverHint: boolean
}
