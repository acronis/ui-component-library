import { UIKitComponent } from './component'

/** Checkbox Button Component */
export declare class ElCheckboxButton extends UIKitComponent {
  /** Value of the checkbox when used inside a checkbox-group */
  label: string | number | boolean

  /** Value of the checkbox if it's checked */
  trueLabel: string | number

  /** Value of the checkbox if it's not checked */
  falseLabel: string | number

  /** If the checkbox is disabled */
  disabled: boolean

  /** If the checkbox is checked */
  checked: boolean

  /** Native 'name' attribute */
  name: string

  /** whether to show browser default hint when hover */
  showHoverHint: boolean
}
