import type { ColorProp, IconProp } from '../../types/props.ts';

export interface AcvListItemProps {
  /**
   * List item data
   */
  data?: object

  /**
   * Whether the list item is draggable
   */
  draggable?: boolean

  /**
   * Whether the list item is closable
   */
  closable?: boolean

  /**
   * List item title
   */
  title?: string

  /**
   * List item subtitle
   */
  subtitle?: string

  color?: ColorProp

  disabled?: boolean

  icon?: IconProp
}

export interface AcvListItemEvents {
  /**
   * Fires when order of item is changed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'change-order', visible: boolean): void

  /**
   * Triggered when the list item is closed
   * @arg {string} eventName - 'close'
   */
  (eventName: 'close'): void
}

export interface AcvListItemSlots {
  /**
   * Content of the list item
   */
  default?: void

  /**
   * Content of the left side of list item
   */
  left?: void

  /**
   * Content of the right side of list item
   */
  right?: void
}
