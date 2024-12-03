import type { Component, VNode } from 'vue';

type MessageType = 'info' | 'success' | 'warning' | 'critical' | 'error' | 'progress';

export const AcvNotificationType = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  CRITICAL: 'critical',
  ERROR: 'error',
  PROGRESS: 'progress',
};

export const AcvNotificationPosition = {
  TOP_RIGHT: 'top-right',
  TOP: 'top',
  TOP_LEFT: 'top-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM: 'bottom',
  BOTTOM_LEFT: 'bottom-left',
};

/** Notification Component */
export interface AcvNotification {
  /** Close the Notification instance */
  close: () => void

  /** Close all Notification instances */
  closeAll: () => void
}

export interface AcvNotificationProperties {
  visible?: boolean

  position?: string

  duration?: number

  customTemplate?: boolean
}

export interface AcvNotificationProps {
  /** Title */
  title?: string

  /** Description text */
  message: string | VNode | Component

  /** Notification type */
  type?: MessageType

  /** Custom icon's class. It will be overridden by type */
  iconClass?: string

  /** Custom class name for Notification */
  customClass?: string

  /** Duration before close. It will not automatically close if set 0 */
  duration?: number

  /** Whether to show a close button */
  showClose?: boolean

  /** Callback function when closed */
  onClose?: () => void

  /**
   * Callback function when notification clicked
   */
  onClick?: () => void

  /**
   * Offset from the top edge of the screen. Every Notification instance of the same moment should have the same offset
   */
  offset?: number

  /**
   * Whether to show browser default hint when hover
   * @default false
   */
  showHoverHint?: boolean
}

export interface AcvNotificationPropsWithMessage extends AcvNotificationProps {
  message: string
}

export interface ActiveNotification {
  dismiss: () => void
}

export interface AcvNotificationPlugin {
  open: ((message: string) => ActiveNotification) & ((options: AcvNotificationPropsWithMessage) => ActiveNotification)

  success: (message: string, options?: Partial<AcvNotificationProps>) => ActiveNotification

  error: (message: string, options?: Partial<AcvNotificationProps>) => ActiveNotification

  info: (message: string, options?: Partial<AcvNotificationProps>) => ActiveNotification

  warning: (message: string, options?: Partial<AcvNotificationProps>) => ActiveNotification

  progress: (message: string, options?: Partial<AcvNotificationProps>) => ActiveNotification

  default: (message: string, options?: Partial<AcvNotificationProps>) => ActiveNotification

  clear: () => void
}

declare module 'vue' {
  interface ComponentCustomProperties {
    /** Displays a global notification message in the upper right corner of the page */
    $notify: AcvNotificationPlugin
  }
}
