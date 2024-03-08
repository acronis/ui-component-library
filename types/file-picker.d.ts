import { UIKitComponent } from './component'

export type FilePickerSize = 'medium' | 'small'

/** FilePicker Component */
export declare class ELFilePicker extends UIKitComponent {

  /** Size of the component */
  size: FilePickerSize

  /** Whether the component is disabled */
  disabled: boolean

  /** The name of the input field */
  name: string

  /** The input label */
  label: string

  /** Icon classname (el-icon-search is default) */
  icon: string

  /** Action-text in the right side (only if no icon shown) */
  browseText: string

  /** Determines whether show an icon */
  showIcon: boolean

  /** Whether the file picker is used in form item */
  embedInFormItem: boolean

  /** Comma separated string of accepted file types */
  accept: string
}
