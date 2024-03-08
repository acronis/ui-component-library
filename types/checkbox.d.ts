import { UIKitComponent } from './component'

/** Checkbox Component */
export declare class ElCheckbox extends UIKitComponent {
  /** The form input value */
  value: string | string[]

  /** Value of the checkbox when used inside a checkbox-group */
  label: string | number | boolean

  /** Value of the checkbox if it's checked */
  trueLabel: string | number

  /** Value of the checkbox if it's not checked */
  falseLabel: string | number

  /** Same as indeterminate in native checkbox */
  indeterminate: boolean

  /** If the checkbox is disabled */
  disabled: boolean

  /** If the checkbox is checked */
  checked: boolean

  /** Native 'name' attribute */
  name: string

  /** aria-controls */
  controls: string

  /** whether to show browser default hint when hover */
  showHoverHint: boolean

  /** Enables multiline display of label */
  multilineLabel: boolean

  /** Limits the number of lines of the label when `multiline-label` is `true`. */
  multilineLabelLimit: number
}
