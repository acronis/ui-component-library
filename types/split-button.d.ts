import { UIKitComponent } from './component'

export type SplitButtonType = 'primary' | 'secondary'
export type SplitButtonPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'

/** Split Button Component */
export declare class ElSplitButton extends UIKitComponent {
  /** Split Button type */
  type: SplitButtonType

  /** Split Button placement */
  placement: SplitButtonPlacement
}
