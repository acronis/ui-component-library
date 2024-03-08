import { UIKitComponent } from './component'

/** Time Picker Component */
export declare class ElTimePicker extends UIKitComponent {
  /** Initial date */
  value: Date

  /** Disable a time picker */
  disabled: boolean

  /** Label in input */
  label: string

  /** Placeholder in input */
  placeholder: string

  /** Enabled when 12-hours format */
  meridiem: boolean
}
