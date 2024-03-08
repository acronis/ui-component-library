import { UIKitComponent } from '../component'
import { VNode } from 'vue'

export interface AboutSlots {
  /** content of the About logo */
  logo: VNode[],

  /** content of the version information */
  versions: VNode[],

  /** area to set action buttons */
  actions: VNode[],

  /** content of the links or other information */
  links: VNode[]

  [key: string]: VNode[]
}


/** About Component */
export declare class ElAbout extends UIKitComponent {
  /** Visibility of Dialog, supports the .sync modifier */
  visible: boolean

  /** Title of the About. */
  title: string

  /** Message of the About. */
  message: string

  /** Whether the message of the About is an error */
  isErrorMessage: boolean

  /** Whether the About Window can be closed by clicking the mask. */
  closeOnClickModal: boolean

  /** Whether the Dialog can be closed by pressing ESC */
  closeOnPressEscape: boolean

  /** Whether a mask is displayed */
  modal: boolean

  /** Whether to append modal to body element. */
  modalAppendToBody: boolean

  /** Whether to append About Window itself to body. */
  appendToBody: boolean

  /** Custom class names for About Window Dialog. */
  customClass: string

  $slots: AboutSlots
}
