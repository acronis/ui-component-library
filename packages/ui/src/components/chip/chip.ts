export interface AcvChipProps {
  /**
   * Icon name of the Chip
   */
  icon?: string

  /**
   * Is close icon visible
   * @defaultValue false
   */
  showClose?: boolean

  /**
   * Is hover hint visible
   * @defaultValue false
   */
  showHoverHint?: boolean
}

export interface AcvChipSlots {
  /**
   * The default Chip content
   */
  default: void
}

export interface AcvChipEvents {
  /**
   * Emitted when the close icon is clicked.
   */
  (e: 'close'): void
}
