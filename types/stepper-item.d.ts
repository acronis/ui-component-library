import { UIKitComponent } from './component'

/** Step Component */
export declare class ElStepperItem extends UIKitComponent {
  /** Step name */
  title: string

  /** Step icon name */
  icon: string

  /** Set initial step state as a visited. */
  defaultVisited: boolean

  /** Allow do something before change step. */
  beforeChange: (newIndex: number, currentIndex: number) => Promise<void>
}
