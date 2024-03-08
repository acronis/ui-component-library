import { UIKitComponent, UIKitComponentSize } from './component'

export type FormItemLabelPosition = 'left' | 'right' | 'top'

export interface ValidateCallback {
  /**
   * The callback to tell the validation result
   *
   * @param isValid Whether the form is valid
   */
  (isValid: boolean): void
}

export interface ValidateFieldCallback {
  /**
   * The callback to tell the field validation result
   *
   * @param errorMessage The error message. It will be empty if there is no error
   */
  (errorMessage: string): void
}

/** Form Component */
export declare class ElForm extends UIKitComponent {
  /** Data of form component */
  model: object

  /** Validation rules of form */
  rules: object

  /** Whether to show the error message */
  showMessage: boolean

  /** Whether to display the error message inline with the form item */
  inlineMessage: boolean

  /**
   * Validate the whole form
   *
   * @param callback A callback to tell the validation result
   */
  validate (callback?: ValidateCallback): void

  /**
   * Validate a certain form item
   *
   * @param prop The property of `model` that is going to validate
   * @param callback A callback to tell the field validation result
   */
  validateField (prop: string, callback: ValidateFieldCallback): void

  /** Reset all the fields and remove validation result */
  resetFields (): void

  /** Clear validation message for all fields */
  clearValidate (): void

  /** Reset `initialValue` in all fields, after that the property 'dirty' becomes false */
  resetInitialValue (): void

  /** instruction hints of form items */
  hints: object
}
