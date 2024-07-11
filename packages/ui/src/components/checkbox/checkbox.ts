import type { ColorProp, ComponentSize } from '../../types/props.ts';
import type { CheckboxProps } from '../../composables/useCheckbox.ts';

export interface AcvCheckboxProps extends CheckboxProps {
  /**
   * Title of the Checkbox
   */
  id?: string

  /**
   * Label text inside default slot
   */
  label?: string

  /**
   * Whether the Checkbox is disabled
   * @defaultValue false
   */
  disabled?: boolean

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
   * Size of the Checkbox
   * @defaultValue 'medium'
   * @values 'small', 'medium', 'large'
   */
  size?: ComponentSize

  /**
   * Color of the Checkbox
   * @defaultValue 'primary'
   * @values 'primary', 'secondary', 'success', 'info', 'warning', 'error'
   */
  color?: ColorProp

  invalid?: boolean

  required?: boolean

  /**
   * Classes for the icon element
   */
  iconClass?: string
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
   * Default slot for rendering checkbox label
   */
  default: () => any
  /**
   * Slot for checkbox icon
   * @binding {boolean} checked - The id of the checkbox
   */
  icon: void
}
