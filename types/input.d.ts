import { UIKitComponent, UIKitComponentSize } from './component'

/** The resizability of el-input component */
export type Resizability = 'none' | 'both' | 'horizontal' | 'vertical'
export type InputType = 'text' | 'textarea'

/** Controls how el-input component automatically sets size */
export interface AutoSize {
  /** Minimum rows to show */
  minRows: number,

  /** Maximum rows to show */
  maxRows: number
}

export interface IconClickEventHandler {
  /** The handler function of on-icon-click property */
  (this: Window, ev: MouseEvent): any
}

/** Input Component */
export declare class ElInput extends UIKitComponent {
  /** Type of input */
  type: InputType

  /** Delete input borders */
  embedded: boolean

  prefixValue: string

  /** Binding value */
  value: string | number

  /** Placeholder of Input */
  placeholder: string

  /** Show eye icon for controlling password visibility */
  showPasswordIcon: boolean

  /** Default type for input with type password */
  defaultType: string

  /** Maximum Input text length */
  maxlength: number

  /** Minimum Input text length */
  minlength: number

  /** Same as auto-complete in native input */
  autoComplete: string

  /** Same as autofocus in native input */
  autofocus: boolean

  /** Whether Input is disabled */
  disabled: boolean

  /** Show clear icon */
  clearable: boolean

  /** Same as readonly in native input */
  readonly: boolean

  /** Show red asterisk to indicate mandatory fields */
  required: boolean

  /** Same as form in native input */
  form: string

  /** Same as name in native input */
  name: string

  /** Same as max in native input */
  max: any

  /** Same as min in native input */
  min: any

  /** Same as step in native input */
  step: any

  /** Set the allowed number of digits after decimal point. */
  precision: number

  /** Masked input. Works only when 'type' is 'text' */
  mask: Object

  label: string

  /** Prefix icon class */
  prefixIcon: string

  /** Suffix icon class */
  suffixIcon: string

  /** Icon color class */
  iconColor: string

  /** Hook function when clicking on the input icon */
  onIconClick: IconClickEventHandler

  /** Size of Input, works when type is not 'textarea' */
  size: UIKitComponentSize

  /** Number of rows of textarea, only works when type is 'textarea' */
  rows: number

  /** Whether textarea has an adaptive height, only works when type is 'textarea' */
  autosize: boolean | AutoSize

  /** Control the resizability */
  resize: Resizability

  validateEvent: boolean

  /** Freeze focus on input element */
  freezeFocus: boolean

  /**
   * inject specific text where cursor is currently located in the component
   *
   * @param text text to insert where cursor is positioned
   */
   injectText (text?: string): void
}
