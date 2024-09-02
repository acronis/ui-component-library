export interface AcvPaginationProps {
  total: number
  limit: number
  modelValue: number
}

export interface AcvPaginationEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} value - The page number
   */
  (eventName: 'update:modelValue', value: number): void
}

export interface AcvPaginationItemProps {
  page: number
  active?: boolean
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
