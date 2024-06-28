import type { InjectionKey, Ref } from 'vue';

export interface AccordionProps {
  /**
   * Active panel id
   */
  modelValue?: string[] | never[]

  /**
   * Height of the accordion
   * @values 'small', 'medium', 'large'
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * Whether the multiple Accordion can be open at the same time
   */
  multiple?: boolean

  /**
   * Expand all accordion items
   */
  expanded?: boolean
}

export interface AccordionSlots {
  /**
   * Default slot for accordion panels
   */
  default: () => any
}

export interface AccordionEvents {
  /**
   * Triggered when binding value changes
   * @arg {string} eventName - The name of the event
   * @arg {any} value - The updated value
   */
  (eventName: 'update:modelValue', value: any): void
}

export interface AccordionPanelProps {
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

export interface AccordionPanelSlots {
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

export interface AccordionInjection {
  multiple: boolean
  openedPanels: Ref<(string | string[] | undefined)[]>
  uuid: Ref<number | undefined>
  handlePanelClick: (id: string) => void
}

export const ACCORDION_KEY = Symbol('ACCORDION_KEY') as InjectionKey<AccordionInjection>;
