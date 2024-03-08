import { UIKitComponent } from '../component'

/** Progress Radial Component */
export declare class ElProgressRadial extends UIKitComponent {
  /** Current value */
  currentValue: number

  /** Size of the Progress Radial */
  size: string

  /** Toggles presence of the icon */
  showIcon: boolean

  /** Toggles presence of the status */
  showStatus: boolean

  /** Total value */
  totalValue: number

  /** Time taken (ms) for animation to complete */
  transitionDuration: number
}
