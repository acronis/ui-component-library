import { UIKitComponent } from './component'

/** Filter Component */
export declare class ElFilter extends UIKitComponent {

  /** Control model of filter */
  value: { type: 'search' | 'filter', value: string | object[] }

  /** Callback called  when apply is pressed */
  applyCallback: { type: 'search' | 'filter', value: string | object[] }

  /** Set of default values of filters that are used for filters resetting */
  defaults: { type: 'search' | 'filter', value: string | object[] }

  /** Property to pass validation into form in ElFilter */
  formRules: {}
}
