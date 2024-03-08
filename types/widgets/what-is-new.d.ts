import { UIKitComponent } from '../component'
import { VNode } from 'vue'

export interface WhatIsNewSlots {
  /** content of the About logo */
  upsellBadge: VNode[],

  [key: string]: VNode[]
}

export class ItemObject {
  /** The title of new item */
  title: string

  /** The content of new item */
  content: string

  /** Name of image slot */
  imageSlot: string

  /** Show or hide upsell badge */
  showUpsellBadge: boolean
}

/** What's new Component */
export declare class ElWhatIsNew extends UIKitComponent {
  /** Visibility of Dialog, supports the .sync modifier */
  visible: boolean

  /** Back button text. */
  backButtonText: string

  /** Next button text. */
  nextButtonText: string

  /** Last screen button text. */
  finishButtonText: string

  /** The item object */
  items: ItemObject[]

  /** Whether the What's new Window can be closed by clicking the mask. */
  closeOnClickModal: boolean

  /** Whether the Dialog can be closed by pressing ESC */
  closeOnPressEscape: boolean

  /** Whether a mask is displayed */
  modal: boolean

  /** Whether to append modal to body element. */
  modalAppendToBody: boolean

  /** Whether to append What's new Window itself to body. */
  appendToBody: boolean

  /** Custom class names for What's new Window Dialog. */
  customClass: string

  $slots: WhatIsNewSlots
}
