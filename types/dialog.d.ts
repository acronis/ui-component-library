import { VNode } from 'vue'
import { UIKitComponent } from './component'

export type DialogWidthSizes = 'small' | 'medium' | 'large' | 'x-large'

export type DialogHeightSizes = 'fixed-auto' | 'fixed-medium'

export interface DialogSlots {
  /** Content of the Dialog */
  default: VNode[],

  /** Content of the Dialog title */
  title: VNode[],

  /** Content of the Dialog aside */
  aside: VNode[],

  /** Content of the Dialog footer */
  footer: VNode[],

  [key: string]: VNode[]
}

/** Informs users while preserving the current page state */
export declare class ElDialog extends UIKitComponent {
  /** Title of Dialog */
  title: string

  /** Width of Dialog */
  width: string

  /** Size of Dialog (predefined widths) */
  widthSize: DialogWidthSizes

  /** Color of the content, excludes aside content */
  color: string

  /** Size of Dialog (predefined widths) */
  heightSize: DialogHeightSizes

  /** Whether a mask is displayed */
  modal: boolean

  /** Whether to append modal to body element. If false, the modal will be appended to Dialog's parent element */
  modalAppendToBody: boolean

  /** whether to append Dialog itself to body. A nested Dialog should have this attribute set to `true` */
  appendToBody: boolean

  /** Whether scroll of body is disabled while Dialog is displayed */
  lockScroll: boolean

  /** Custom class names for Dialog */
  customClass: string

  /** Whether the Dialog can be closed by clicking the mask */
  closeOnClickModal: boolean

  /** Whether the Dialog can be closed by pressing ESC */
  closeOnPressEscape: boolean

  /** Whether to show a close button */
  showClose: boolean

  /** Dialog variant: 'default', 'clean' or 'clean-basic' or 'fullscreen' */
  variant:  'default' | 'clean' | 'clean-basic' | 'fullscreen'

  /** Dialog position: 'center', 'top' */
  position: 'center' | 'top'

  /** Callback before Dialog closes, and it will prevent Dialog from closing */
  beforeClose: (done: Function) => void

  /** Whether to align the header and footer in center */
  center: boolean

  /** Whether to hide footer when it is empty while retaining occupied space */
  hideFooterWhenEmpty: boolean

  $slots: DialogSlots
}

