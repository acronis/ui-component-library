import { UIKitComponent } from './component'

/** Filter Component */
export declare class ElMultiSearch extends UIKitComponent {
  /** The value of filter and search */
  value: string

  /** Property to pass validation into form in ElFilter */
  formRules: {}

  /** Set of default values of filters that are used for filters resetting */
  filterDefaults: object

  /** A short hint describing the expected value */
  placeholder: string

  hideFilter: boolean

  applyCallback: Function
}
