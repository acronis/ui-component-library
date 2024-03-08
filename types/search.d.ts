import { UIKitComponent } from './component'

export interface FetchSuggestionsCallback {
  /**
   * Callback function used in fetch-suggestions function
   *
   * @param data Suggestions to use
   */
  (data: any[]): void
}

export interface FetchSuggestions {
  /**
   * The function passed into the fetch-suggestions property
   *
   * @param queryString Current value of the text input
   * @param callback Callback function used to indicate that suggestions have completely fetched
   */
  (queryString: string, callback: FetchSuggestionsCallback): void
}

/** Search Component */
export declare class ElSearch extends UIKitComponent {
  /** The form input value */
  value: string

  /** type of search */
  type: string

  /** a short hint describing the expected value */
  placeholder: string

  /** String for no data message */
  noDataMessage: string

  /** Enable suggestions */
  autocomplete: boolean

  /** Allow extend of popper class */
  suggestionsClass: string
}
