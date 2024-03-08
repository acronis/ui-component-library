import { UIKitComponent, UIKitComponentSize } from './component'
import {DropdownMenuAlignment} from './dropdown';

export interface QueryChangeHandler {
  /**
   * @param queryString Current value of the text input
   */
  (queryString: string): void
}

export interface QueryScrollHandler {
  /**
   * @param queryString Current value of the text input
   */
  (queryString: string): void
}

/** Dropdown Select Component */
export declare class ElSelect extends UIKitComponent {
  /** The form input value */
  value: any

  /** Enable 'select-all' functionality */
  selectAll: boolean | string

  /** Custom text displayed when all elements are selected in 'select-all' mode */
  allItemsSelectedText: string

  /** Whether multiple-select is activated */
  multiple: boolean

  /** Whether Select is disabled */
  disabled: boolean

  /** Unique identity key name for value, required when value is an object */
  valueKey: string

  /** Size of Input */
  size: UIKitComponentSize

  /** Whether single select can be cleared */
  clearable: boolean

  /** Enable readonly input behavior */
  readonly: boolean

  /** Open dropdown only by icon click */
  openOnIconClick: boolean

  /** Close dropdown when scroll the window */
  hideOnScroll: boolean

  /** Maximum number of options user can select when multiple is true. No limit when set to 0 */
  multipleLimit: number

  /** Maximum number of option labels to show when multiple0 is true */
  multipleShowItemsLimit: number

  /** The name attribute of select input */
  name: string

  /** Placeholder */
  placeholder: string

  /** Placeholder Icon */
  placeholderIcon: string

  /** Placeholder Icon Color */
  placeholderIconColor: string

  /** Placeholder of Search */
  searchPlaceholder: string

  /** Label */
  label: string

  /** Whether Select is filterable */
  filterable: boolean

  /** Custom filter method */
  filterMethod: QueryChangeHandler

  /** Whether options are loaded from server */
  remote: boolean

  /** Custom remote search method */
  remoteMethod: QueryChangeHandler

  /** Custom remote search scroll method used for infinite scrolling */
  remoteScrollMethod: QueryScrollHandler

  /** Total count for the search results */
  remoteSearchResultsCount: number | string

  /** Whether Select is loading data from server */
  loading: boolean

  /** Whether Select is loading infinite scrolling data from server */
  scrollLoading: boolean

  /** Whether search result reach the end of scroll and `remote-scroll-method` will not be called */
  isScrollEnd: boolean

  /** Displayed text while loading data from server */
  loadingText: string

  /** Displayed text when no data matches the filtering query */
  noMatchText: string

  /** Displayed text when there is no options */
  noDataText: string

  /** Custom class name for Select's dropdown */
  popperClass: string

  /** Placement of Select's dropdown */
  popperPlacement: DropdownMenuAlignment

  /** Max width of Select's dropdown */
  popperMaxWidth: string

  /** Max height of Select's dropdown */
  popperMaxHeight: string

  /** Select first matching option on enter key. Use with filterable or remote */
  defaultFirstOption: boolean

  /** Whether to emit change and input event on options removal */
  changeOnOptionsRemoval: boolean

  /** Custom text displayed in Select's input */
  customText: boolean

  /** Custom hint message passed to the title attribute of Select' input */
  customHint: boolean

  /** To show icon of the selected option with icon */
  showSelectedIcon: boolean

  /** Dynamic width of dropdown list */
  dynamicWidth: boolean

  /** Prevnet Hiding of dropdown when click outside */
  preventHideOnClick: boolean
}
