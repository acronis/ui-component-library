import type { RouteLocationRaw } from 'vue-router';

export interface BreadcrumbsProps {
  /**
   * Maximum number of items to display
   */
  maxItems?: number

  /**
   * Breadcrumb will be wrapped to multiple lines if true
   */
  multiline?: boolean

  /**
   * Separator between breadcrumbs
   */
  separatorIcon?: string

  /**
   * Size of the breadcrumbs
   */
  size?: 'md' | 'lg'
}

export interface BreadcrumbsEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface BreadcrumbsSlots {
  /**
   * Default slot
   */
  default: void

  /**
   * Slot for the separator
   */
  separator: void
}

export interface BreadcrumbLinkProps {
  /**
   * Target of the link, same as `to` in Vue Router
   */
  to: RouteLocationRaw
}

export interface BreadcrumbLinkSlots {
  /**
   * Link content
   */
  default: void
}

export interface BreadcrumbLinkEvents {
  /**
   * Triggered when the breadcrumb link is clicked
   * @arg {string} eventName - The name of the event
   */
  (eventName: 'click'): void
}
