export interface AcvPaginationProps {
  /** Total number of data items */
  total: number
  /** Number of data items per page */
  limit: number
  /** Current page number */
  modelValue: number
};

export interface AcvPaginationEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} value - The page number
   */
  (eventName: 'update:modelValue', value: number): void
}

export interface AcvPaginationItemProps {
  /** Page number */
  page: number
  /** Whether the page is active */
  active?: boolean
  /** Whether the page is disabled */
  disabled?: boolean
}

export interface AcvPaginationItemEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} page - The page number
   */
  (eventName: 'select', page: number): void
}
