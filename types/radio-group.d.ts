import { UIKitComponent } from './component'

export type RadioGroupSize = 'large' | 'small'

/** Radio Group Component */
export declare class ElRadioGroup extends UIKitComponent {

  /** Whether the nesting radios are disabled */
  disabled: boolean

  /** The size of radio buttons */
  size: RadioGroupSize
}
