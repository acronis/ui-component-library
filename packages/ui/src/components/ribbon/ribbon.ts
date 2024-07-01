export interface RibbonAlert {
  /**
   * The alert title
   */
  title: string

  /**
   * The alert message
   */
  description: string
  /**
   * The alert type
   */
  type: 'info' | 'success' | 'warning' | 'critical' | 'error'

  /**
   * The alert link
   */
  link: RibbonLink
}

export interface RibbonLink {
  href: string
  target?: string
  title: string
  click?: () => void
}

export interface RibbonProps {
  /**
   * List of alerts
   */
  alerts?: RibbonAlert[]

  variant?: 'info' | 'success' | 'warning' | 'critical' | 'error'

  /**
   * The alert title
   */
  title?: string

  /**
   * The alert message
   */
  description?: string

  /**
   * Hide the close button
   */
  hideClose?: boolean

  /**
   * Show the close button
   */
  closeable?: boolean
}

export interface RibbonEvents {
  /**
   * Triggered when the alert is closed
   * @arg {string} eventName - The name of the event
   * @arg {number} alertIndex - The alert index
   */
  (eventName: 'close', alertIndex: number): void
}

export interface RibbonSlots {
  /**
   * The default slot content
   */
  default: void
}
