import { UIKitComponent } from './component'

export type ProgressType = 'line' | 'circle'
export type ProgressSize = 'medium' | 'small'

/** Progress Component */
export declare class ElProgress extends UIKitComponent {
  /** Percentage, required */
  percentage: number

  /** The type of progress bar */
  type: ProgressType

  /** The size of progress bar */
  size: ProgressSize

  /** The color of progress bar */
  color: 'brand-secondary' | 'fixed-success-lighter' | 'fixed-warning' | 'fixed-critical' | 'fixed-danger' | 'chart-*'

  /** The class defining the color of progress bar */
  colorClass: string

  /** Enable or freeze animation */
  animate: boolean | 'freeze'

  /** Segment data */
  segments: object[]

  /** Type of interaction */
  interaction: string
}
