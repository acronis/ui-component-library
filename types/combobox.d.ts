import { UIKitComponent, UIKitComponentSize } from './component'
import {DropdownMenuAlignment} from './dropdown';

export interface QueryChangeHandler {
  /**
   * @param queryString Current value of the text input
   */
  (queryString: string): void
}

/** Combobox Component */
export declare class ElCombobox extends UIKitComponent {
  /** The form input value */
  value: any

  /** Whether Combobox is disabled */
  disabled: boolean

  /** Unique identity key name for value, required when value is an object */
  valueKey: string

  /** Size of Input */
  size: UIKitComponentSize

  /** Show eye icon */
  showPasswordIcon: boolean

  /** Default type for input with type password */
  defaultType: string

  /** Maximum number of options user can select when multiple is true. No limit when set to 0 */
  multipleLimit: number

  /** The name attribute of select input */
  name: string

  /** Placeholder */
  placeholder: string

  /** Placeholder of Search */
  searchPlaceholder: string

  /** Label */
  label: string

  /** Whether Combobox is filterable */
  filterable: boolean

  /** Custom filter method */
  filterMethod: QueryChangeHandler

  /** Whether options are loaded from server */
  remote: boolean

  /** Custom remote search method */
  remoteMethod: QueryChangeHandler

  /** Whether Combobox is loading data from server */
  loading: boolean

  /** Displayed text while loading data from server */
  loadingText: string

  /** Displayed text when no data matches the filtering query */
  noMatchText: string

  /** Displayed text when there is no options */
  noDataText: string

  /** Custom class name for Combobox's dropdown */
  popperClass: string

  /** Placement of Combobox's dropdown */
  popperPlacement: DropdownMenuAlignment

  /** Max width of Combobox's dropdown */
  popperMaxWidth: string

  /** Max height of Combobox's dropdown */
  popperMaxHeight: string

  /** Combobox first matching option on enter key. Use with filterable or remote */
  defaultFirstOption: boolean
}
