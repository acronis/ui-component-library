import type { AcvOptionProps } from '@/components/__dev__/option/option.ts';
import type { ComponentSize } from '@/types/props.ts';
import type { InjectionKey, VNode } from 'vue';

export interface AcvSelectProps {
  modelValue?: string

  /**
   * Placeholder text
   */
  placeholder?: string

  disabled?: boolean

  size?: ComponentSize

  options?: AcvOptionProps[]

  validationStatus?: 'success' | 'error'
}

export interface AcvSelectEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'update:modelValue', visible: boolean): void
  (eventName: 'change', value: AcvSelectProps['modelValue']): void
  (eventName: 'input', value: AcvSelectProps['modelValue']): void
}

export interface AcvSelectSlots {
  /**
   * The default slot content
   */
  default: () => any
  /**
   * The description slot content
   * @binding {string} description - The description prop value
   */
  description: void
}

export interface AcvSelectInjection {
  selectedIndex?: number
  options?: VNode<AcvOptionProps>[]
  count?: number
}

export const SELECT_KEY = Symbol('SELECT_KEY') as InjectionKey<AcvSelectInjection>;
