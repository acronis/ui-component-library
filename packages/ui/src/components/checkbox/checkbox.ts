export interface CheckboxProps {
  /**
   * Title of the Checkbox
   */
  id?: string

  /**
   * Value of the Checkbox when used inside a `checkbox-group`
   */
  label?: string | number | boolean

  /**
   * Value of the Checkbox if it's checked
   */
  trueValue?: string | number

  /**
   * Value of the Checkbox if it's not checked
   */
  falseValue?: string | number

  /**
   * Same as `indeterminate` in native checkbox
   * @defaultValue false
   */
  indeterminate?: boolean

  /**
   * Whether the Checkbox is disabled
   * @defaultValue false
   */
  disabled?: boolean

  /**
   * Whether Checkbox is checked
   * @defaultValue false
   */
  checked?: boolean

  /**
   * Native `name` attribute
   */
  name?: string

  /**
   * Show browser's default title hint
   * @defaultValue false
   */
  showHint?: boolean

  /**
   * Enables multiline label
   * @defaultValue false
   */
  multilineLabel?: boolean

  /**
   * Limit the number of lines of the label
   */
  multilineLabelLimit?: number

  /**
   * Value of the Checkbox
   */
  modelValue: boolean | string[]

  /**
   * Size of the Checkbox
   * @defaultValue 'medium'
   * @values 'small', 'medium', 'large'
   */
  size?: string

  /**
   * Color of the Checkbox
   * @defaultValue 'primary'
   * @values 'primary', 'secondary', 'success', 'info', 'warning', 'error'
   */
  color?: string
}

export interface CheckboxEvents {
  /**
   * Triggered when binding value changes
   * @arg {string} eventName - The name of the event
   * @arg {any} value - The updated value
   */
  (eventName: 'update:modelValue', value: any): void
  /**
   * Triggered when indeterminate state changes
   * @arg {string} eventName - The name of the event
   * @arg {boolean} value - Indeterminate state value
   */
  (eventName: 'update:indeterminate', value: boolean): void
}

export interface CheckboxSlots {
  /**
   * Slot for checkbox label
   */
  default: void
  /**
   * Slot for checkbox icon
   * @binding {boolean} checked - The id of the checkbox
   */
  icon: void
}
