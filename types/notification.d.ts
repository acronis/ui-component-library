import Vue, { VNode, VueConstructor } from 'vue'
import { UIKitComponent } from './component'

type MessageType = 'info' | 'success' | 'warning' | 'critical' | 'error'

/** Notification Component */
export declare class ElNotification extends Vue {
  /** Close the Notification instance */
  close (): void

  /** Close all Notification instances */
  closeAll (): void
}

export interface ElNotificationProperties {
  visible?: boolean

  position?: string

  duration?: number

  customTemplate?: boolean
}

export interface ElNotificationOptions {
  /** Title */
  title?: string

  /** Description text */
  message: string | VNode | VueConstructor

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

  /** Callback function when notification clicked */
  onClick?: () => void

  /** Offset from the top edge of the screen. Every Notification instance of the same moment should have the same offset */
  offset?: number

  /** whether to show browser default hint when hover */
  showHoverHint?: boolean
}

export interface ElNotificationTypes {
  /** Show a notification */
  (options: ElNotificationOptions): ElNotification
  (properties: ElNotificationProperties): ElNotification

  /** Show an info notification */
  info (message: string | VNode): ElNotification

  /** Show an info notification */
  info (options: ElNotificationOptions): ElNotification

  /** Show a success notification */
  success (message: string | VNode): ElNotification

  /** Show a success notification */
  success (options: ElNotificationOptions): ElNotification

  /** Show a warning notification */
  warning (message: string | VNode): ElNotification

  /** Show a warning notification */
  warning (options: ElNotificationOptions): ElNotification

  /** Show an critical notification */
  critical (message: string | VNode): ElNotification

  /** Show an critical notification */
  critical (options: ElNotificationOptions): ElNotification

  /** Show an error notification */
  error (message: string | VNode): ElNotification

  /** Show an error notification */
  error (options: ElNotificationOptions): ElNotification
}

declare module 'vue/types/vue' {
  interface Vue {
    /** Displays a global notification message at the upper right corner of the page */
    $notify: ElNotification
  }
}
