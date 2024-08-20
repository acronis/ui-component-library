export interface AcvDialogProps {
  /**
   * Dialog visibility state
   */
  modelValue?: boolean

  /**
   * Width of Dialog default to wrap content width
   *
   * @defaultValue 'small'
   */
  width?: 'small' | 'medium' | 'large' | 'x-large'

  /**
   * Height of Dialog default to wrap content height
   *
   * @defaultValue 'small'
   */
  height?: 'auto' | 'fit' | 'small' | 'medium' | 'large'

  /**
   * Title of the Dialog,
   * can also be passed with the slot
   */
  title?: string

  /**
   * Whether the Dialog is closable,
   * shows close icon on top right
   *
   * @defaultValue true
   */
  closable?: boolean

  /**
   * Whether the Dialog is draggable
   *
   * @defaultValue false
   */
  draggable?: boolean

  // TODO: implement props
  // resizable?: boolean
  //
  // loading?: boolean

  // minWidth?: number
  //
  // minHeight?: number
  //
  // transitionName?: string

  /**
   * Type of the Dialog
   */
  type?: 'default' | 'clean'

  /**
   * Whether modal mask is displayed
   *
   * @defaultValue true
   */
  backdrop?: boolean

  /**
   * Whether scroll is locked
   */
  lockScroll?: boolean

  /**
   * Whether focus is locked
   */
  lockFocus?: boolean

  /**
   * Whether to close the Dialog when escape key is pressed
   *
   * @defaultValue true
   */
  closeOnEscape?: boolean

  /**
   * Whether to close the Dialog when the mask is clicked
   *
   * @defaultValue true
   */
  closeOnClickOutside?: boolean
}

export interface AcvDialogEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void

  /**
   * Triggered when the component is opened
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'open', visible: boolean): void

  /**
   * Triggered when the modelValue is updated
   * @arg {string} eventName - The name of the event
   * @arg {string} value - The new value of the model
   */
  (eventName: 'update:modelValue', value: any): void
}

export interface AcvDialogSlots {
  /**
   * Content of the Dialog
   */
  default?: void

  /**
   * Title of the Dialog
   */
  title?: () => NonNullable<unknown>

  /**
   * Footer of the Dialog
   */
  footer?: () => NonNullable<unknown>
}
