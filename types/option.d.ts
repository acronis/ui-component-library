import { UIKitComponent } from './component'

/** Right icon */
export interface RightIcon {
  /** Color of icon */
  color: string,

  /** Name of icon */
  name: string
}

/** Dropdown Select Option Component */
export declare class ElOption extends UIKitComponent {
  /** Value of option */
  value: any

  /** Label of option, same as value if omitted */
  label: string

  /** Sub value of option */
  subLabel: string

  /** Whether option is disabled */
  disabled: boolean

  /** Icon displayed on the left */
  icon: string

  /** Color of the Icon displayed on the left */
  iconColor: string

  /** Whether checkbox is needed */
  checkbox: boolean

  /** Names and colors of icons to displayed on the right of label */
  rightIcons: RightIcon[]
}
