import { UIKitComponent } from './component'

/** InputNumber Component */
export declare class ElNumPicker extends UIKitComponent {

  /** Binding value */
  value: number

  /** The minimum allowed value */
  min: number

  /** The maximum allowed value */
  max: number

  /** Incremental step */
  step: number

  prefix: string

  suffix: string

  /** Whether the component is disabled */
  disabled: boolean

  /** Debounce delay when typing, in milliseconds */
  debounce: number

  /** Same as name in native input */
  name: string

  label: string

  /** Whether infinity sign is shown */
  infinity: boolean
}
