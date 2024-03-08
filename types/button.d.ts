import { UIKitComponent, UIKitComponentSize } from './component'
import {ButtonType} from "../packages/button/src/ButtonTypes";

/** Button type */
export { ButtonType };

/** Same as native button's type */
export type ButtonNativeType = 'button' | 'submit' | 'reset' | 'menu'

/** Button Component */
export declare class ElButton extends UIKitComponent {
  /** Button type */
  type: ButtonType

  /** Same as native button's type */
  nativeType: ButtonNativeType

  /** Button icon, accepts an icon name of Element icon component */
  icon: string

  /** Button height for fluid variant */
  height: '32' | '48'

  /** Button size */
  size: UIKitComponentSize

  /** Same as native button's autofocus */
  autofocus: boolean

  /** Disable the button */
  disabled: boolean

  /** Determine whether it's loading */
  loading: boolean

  /** Whether button should fill all available width */
  fluid: boolean

  /** Turn on multiline mode */
  multiline: boolean

  /** Inverse button colors */
  inverse: boolean

  /** whether to show browser default hint when hover */
  showHoverHint: boolean

  /** to determine if icon is on left or right for ghost button */
  rightIcon: boolean
}
