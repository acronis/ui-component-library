import type { IconProp } from '@/types/props.ts';

export interface AcvMenuItemProps {
  /**
   * Unique identifier
   */
  index?: string

  /**
   * Title of the item
   */
  title?: string

  /**
   * Icon component to display
   */
  icon?: IconProp

  /**
   * Icon size
   * @values 'sm', 'md', 'lg', 'xl'
   * @default 'md'
   */
  iconSize?: string

  /**
   * Whether the item is multiline
   * @values true, false, 2, 3
   * @default false
   */
  clamp?: boolean | number

  /**
   * Whether route is active
   */
  route?: string | object

  /**
   * Whether the item is disabled
   */
  disabled?: boolean

  /**
   * Whether route is exact
   */
  exact?: boolean

  /**
   * Whether to show hover hint
   */
  showHoverHint?: boolean
}

export interface AcvMenuItemEvents {
  /**
   * Triggered when the component is clicked
   * @arg {string} eventName - The name of the event
   */
  (eventName: 'click'): void

  /**
   * Triggered when the component is hovered
   * @arg {string} eventName - The name of the event
   */
  (eventName: 'mousedown'): void

  /**
   * Triggered when the component is blurred
   * @arg {string} eventName - The name of the event
   */
  (eventName: 'mouseup'): void
}

export interface AcvMenuItemSlots {
  /**
   * The default slot content
   */
  default: void

  /**
   * Icon slot
   */
  icon?: (() => NonNullable<unknown>)

  /**
   * Title
   * @binding {string} title - content of the title
   */
  title?: string | (() => NonNullable<unknown>)

  /**
   * The subtitle slot content
   * @binding {string} subtitle - The subtitle prop value
   */
  subtitle?: () => NonNullable<unknown>
}
