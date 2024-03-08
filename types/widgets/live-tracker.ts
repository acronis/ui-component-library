import { UIKitComponent } from '../component'

/** Live Tracker Item */
export interface LiveTrackerItem {
  /** Name of item */
  name: string,

  /** Icon */
  icon: string,

  /** Current value */
  current: number,

  /** Total value */
  total: number,

  /** Label for current value */
  currentText: string,

  /** Label for total value */
  totalText: string
}

/** Live Tracker Component */
export declare class ElLiveTracker extends UIKitComponent {
  /* Live Tracker data */
  data: LiveTrackerItem[]

  /* Column span of each item when width of screen is <768px */
  xs: number

  /* Column span of each item when width of screen is ≥768px */
  sm: number

  /* Column span of each item when width of screen is ≥992px */
  md: number

  /* Column span of each item when width of screen is ≥1200px */
  lg: number

  /* Column span of each item when width of screen is ≥1920px */
  xl: number
}
