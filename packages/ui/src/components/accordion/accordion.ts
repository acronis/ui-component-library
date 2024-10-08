import type { InjectionKey, Ref } from 'vue';
import type { ComponentSize } from '../../types/props.ts';

export interface AcvAccordionProps {
  /**
   * Active panel id
   */
  modelValue?: string[] | never[]

  /**
   * Height of the accordion
   * @values 'small', 'medium', 'large'
   */
  size?: ComponentSize

  /**
   * Whether the multiple Accordion can be open at the same time
   */
  multiple?: boolean

  /**
   * Expand all accordion items
   */
  expanded?: boolean
}

export interface AcvAccordionSlots {
  /**
   * Default slot for accordion panels
   */
  default: () => any
}

export interface AcvAccordionEvents {
  /**
   * Triggered when binding value changes
   * @arg {string} eventName - The name of the event
   * @arg {any} value - The updated value
   */
  (eventName: 'update:modelValue', value: any): void
}

export interface AcvAccordionPanelProps {
  /**
   * ID of the accordion item
   */
  id: string

  /**
   * Position of the trigger
   * @values 'left', 'right'
   * @default 'left'
   */
  triggerPosition?: string

  /**
   * Set the background color of the title
   */
  titleBackground?: string

  /**
   * Set the background color of the panel
   */
  background?: string

  /**
   * Title of the accordion item
   */
  title?: string

  /**
   * Show/hide accordion trigger
   */
  noTrigger?: boolean

  /**
   * No display border between title and content
   */
  noBorder?: boolean

  /**
   * No padding for the accordion item
   */
  noPadding?: boolean

  /**
   * Whether the accordion item is disabled
   */
  disabled?: boolean
}

export interface AcvAccordionPanelSlots {
  /**
   * Content of the accordion panel
   */
  default: void

  /**
   * Custom label of the accordion item
   */
  label: void

  /**
   * Custom trigger of the accordion item
   */
  trigger: void
}

export interface AcvAccordionInjection {
  multiple: boolean
  openedPanels: Ref<(string | string[] | undefined)[]>
  uuid: Ref<number | undefined>
  handlePanelClick: (id: string) => void
  registerPanel: (id: string) => void
  unregisterPanel: (id: string) => void
}

export const ACCORDION_KEY = Symbol('ACCORDION_KEY') as InjectionKey<AcvAccordionInjection>;
