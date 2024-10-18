import type { Component } from 'vue';

export interface AcvBreadcrumbsProps {
  /**
   * Maximum number of items to display
   */
  maxItems?: number

  /**
   * Breadcrumb will be wrapped to multiple lines if true
   */
  multiline?: boolean

  /**
   * Separator icon/character between breadcrumbs
   */
  separatorIcon?: Component
  separator?: string
  /**
   * Size of the breadcrumbs
   */
  size?: 'md' | 'lg'
}

export interface AcvBreadcrumbsEvents {
  /**
   * Triggered when a breadcrumb item is clicked
   * @param eventName
   * @arg {string} path - The path of the clicked item
   */
  (eventName: 'click', path: string): void
}

export interface AcvBreadcrumbsSlots {
  /**
   * Default slot for breadcrumb items
   */
  default: void
}

export interface AcvBreadcrumbItemProps {
  /**
   * Target of the link, same as *`to`* in Vue Router
   */
  to: string

  /**
   * Whether the item is active (current page)
   */
  active?: boolean
}

export interface AcvBreadcrumbItemSlots {
  /**
   * Default slot for item content
   */
  default: void

  /**
   * Slot for custom icon
   */
  icon?: void
}

export interface AcvBreadcrumbItemEvents {
  /**
   * Triggered when the breadcrumb item is clicked
   * @arg {string} eventName - The name of the event
   * @arg {string} path - The path of the clicked item
   */
  (eventName: 'click', path: string): void
}

export interface AcvBreadcrumbLinkProps {
  /**
   * Target of the link, same as *`to`* in Vue Router
   */
  to: string | Record<string, unknown>

  /**
   * Whether the link is active (current page)
   */
  active?: boolean
}

export interface AcvBreadcrumbLinkSlots {
  /**
   * Default slot for link content
   */
  default: void
}

export interface AcvBreadcrumbLinkEvents {
  /**
   * Triggered when the breadcrumb link is clicked
   * @arg {string} eventName - The name of the event
   * @arg {string | Record<string, unknown>} to - The target of the link
   */
  (eventName: 'click', to: string | Record<string, unknown>): void
}
