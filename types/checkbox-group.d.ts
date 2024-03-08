import { UIKitComponent, UIKitComponentSize } from './component'

/** Checkbox Group Component */
export declare class ElCheckboxGroup extends UIKitComponent {
  /** Whether the nesting checkboxes are disabled */
  disabled: boolean

  /** Size of checkbox buttons or bordered checkboxes */
  size: UIKitComponentSize

  /** Minimum number of checkbox checked */
  min: number

  /** Maximum number of checkbox checked */
  max: number
}
