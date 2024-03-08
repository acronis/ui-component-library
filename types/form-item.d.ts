import { UIKitComponent, UIKitComponentSize } from './component'

/** FormItem Component */
export declare class ElFormItem extends UIKitComponent {
  /** A key of `model` of the enclosing `el-form` component */
  prop: string

  /** Label */
  label: string

  /** Whether the field is required or not, will be determined by validation rules if omitted */
  required: boolean

  /** Validation rules of form */
  rules: object

  /** Field error message, set its value and the field will validate error and show this message immediately */
  error: string | boolean | Array<string>

  /** Inline style validate message, overrides form inline-message */
  inlineMessage: boolean

  /** Whether to show the error message */
  showMessage: boolean

  /** Reset `initialValue` field, after that the property 'dirty' becomes false */
  resetInitialValue (): void

  /** instruction hint */
  hint: string
}
