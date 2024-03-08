import { UIKitComponent } from './component'

/** The component is used in various wizards and shows the entire path that the user needs to go through in order to complete the installation or configuration of certain modules within the interface. */
export declare class ElStepper extends UIKitComponent {
  /** Current activation step */
  value: number

  /** Display direction */
  horizontal: boolean

  /** Allow user click event to completed or visited steps */
  interactive: boolean
}
