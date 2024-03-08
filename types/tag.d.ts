import { UIKitComponent } from './component'

export type TagType = 'success' | 'warning' | 'critical' | 'danger' | 'info' | 'inactive' | 'adaptive' | 'white'

/** Tag Component */
export declare class ElTag extends UIKitComponent {
  /** Type. `inactive` and `adaptive` works only if `inverse` is `false`, `white` works only if `inverse` is `true`. `adaptive` to be only used for left navigation. */
  type: TagType

  /** Inverted state */
  inverse: boolean
}
