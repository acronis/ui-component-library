import { UIKitComponent } from './component'

/** Radio Component */
export declare class ElRadio extends UIKitComponent {
  /** The form input value */
  value: string

  /** The value of radio */
  label: string | number | boolean

  /** Whether radio is disabled */
  disabled: boolean

  /** Native 'name' attribute */
  name: string

  /** whether to show browser default hint when hover */
  showHoverHint: boolean
}
