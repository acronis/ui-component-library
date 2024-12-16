export const TYPE = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  critical: 'critical',
  danger: 'danger',
  neutral: 'neutral',
} as const;

export type AcvRibbonType = keyof typeof TYPE;

export interface AcvRibbonAlert {
  /**
   * The alert message
   */
  description: string
  /**
   * The alert type
   */
  type: AcvRibbonType

  /**
   * The alert link
   */
  link?: AcvRibbonLink
}

export interface AcvRibbonLink {
  href: string
  target?: string
  title: string
  click?: () => void
}

export interface AcvRibbonProps {
  /**
   * List of alerts
   * @values [{ description: string, type: string, link?: { href: string, target?: string, title: string, click: () => void } }]
   * @defaultValue []
   */
  alerts?: AcvRibbonAlert[]

  /**
   * Hide the close button
   * @values true, false
   * @defaultValue false
   */
  hideClose?: boolean
}

export interface AcvRibbonEvents {
  /**
   * Triggered when the alert is closed
   * @arg {number} alertIndex - The alert index
   */
  (eventName: 'close', alertIndex: number): void
}

export interface AcvRibbonSlots {
  /**
   * The default slot content
   */
  default: void
}
