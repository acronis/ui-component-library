import { UIKitComponent } from '../component'

/** Loading Complex Component */
export declare class ElLoadingComplex extends UIKitComponent {
  /* Loading status */
  isLoading: boolean

  /* Header text */
  header: string

  /* Loading text */
  text: string

  /* Loading text color */
  textColor: string

  /* Action text */
  actionLabel: string

  /* Action callback when selected */
  action: Function

  /* Size of the spinner */
  size: string

  /* Color of spinner */
  color: string

  /* Opacity of the loading backdrop  */
  opacity: string

  /* Background color of the loading backdrop */
  background: string

  /* Determines if loading text is inline */
  inline: boolean
}
