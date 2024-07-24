import type { InjectionKey } from 'vue';
import type { AcvListItemProps } from '../list-item/listItem.ts';
import type { SelectionProps } from '../../composables/useSelection.ts';
import type { ColorProp } from '../../types/props.ts';

export interface AcvListProps extends SelectionProps {
  /**
   * Whether the animation is enabled
   */
  animate?: boolean

  /**
   * Whether to render items as cards
   */
  card?: boolean

  /**
   * List of items
   */
  items?: string[] | number[] | AcvListItemProps[]

  /**
   * Whether the list is sortable
   */
  sortable?: boolean

  /**
   * Whether the list is selectable
   */
  selectable?: boolean

  modelValue?: any

  color?: ColorProp

  variant?: string

  states?: string[]
}

export interface AcvListSlots {
  /**
   * Content of the list
   */
  default: void

  /**
   * Content of the list item
   *
   * @binding {object} item - The item data to pass to the slot
   */
  item: (item) => NonNullable<unknown>
}

export interface AcvListEvents {
  /**
   * Whether modelValue is updated
   * @arg {string} eventName - The name of the event
   * @arg {string} value - The visibility state of the component
   */
  (eventName: 'update:modelValue', value: AcvListProps['modelValue']): void
  /**
   * Whether item is clicked
   * @arg {string} eventName - The name of the event
   * @arg {string} item - The visibility state of the component
   */
  (eventName: 'itemClick', item: AcvListItemProps): void

  /**
   * Triggered when the list item is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvListInjection {
  card?: boolean
  sortable?: boolean
}

export const LIST_KEY = Symbol('LIST_KEY') as InjectionKey<AcvListInjection>;
