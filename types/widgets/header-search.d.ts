import { UIKitComponent } from '../component'

export interface FetchSuggestionsCallback {
  /**
   * Callback function used in fetch-suggestions function
   *
   * @param data Suggestions to use
   */
  (data: any[]): void
}

/** Header Component */
export declare class ElHeaderSearch extends UIKitComponent {
  /* control bottom border */
  querySearch: (queryString: string, callback: FetchSuggestionsCallback) => void

  /* a method to pass to search select event */
  onSelect: (item: any) => void

  /** the placeholder text */
  placeholder: string

  /* allow fixed width */
  width: string
}
