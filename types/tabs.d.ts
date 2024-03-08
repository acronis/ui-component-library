import { UIKitComponent } from './component'

export type TabType = 'card' | 'border-card'
export type TabPosition = 'top' | 'right' | 'bottom' | 'left'

/** Divide data collections which are related yet belong to different types */
export declare class ElTabs extends UIKitComponent {
  /** Binding value of the selected tab */
  value: string

  /** Default selected tab */
  defaultActive: string

  /** Whether tab is large */
  large: boolean

  /** Hide divider under navigation */
  noDivider: boolean

  /** Disable margins navigation panel */
  noMargin: boolean
}
