import { VNode, VNodeDirective } from 'vue'
import { UIKitComponent } from './component'

export interface CardSlots {
  /** Content of the card */
  default: VNode[],

  [key: string]: VNode[]
}

/** Integrate information in a card container */
export declare class ElCard extends UIKitComponent {

  /** CSS style of body */
  bodyStyle: object

  /** Is card modal? */
  modal: boolean

  /** Is this card focused? */
  focus: boolean

  /** Set border-color of card */
  borderColor: string

  /** Set background-color of card */
  backgroundColor: string

  $slots: CardSlots
}
