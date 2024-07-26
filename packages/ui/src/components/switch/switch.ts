import type { ColorProp, ComponentSize } from '@/types/props.ts';

export interface AcvSwitchProps {
  /**
   * Binding value of the Switch
   */
  modelValue?: boolean

  /**
   * Custom color of the Switch
   * @defaultValue primary
   */
  color?: ColorProp

  /**
   * Switch description
   */
  label?: string

  /**
   * Switch size
   */
  size?: ComponentSize

  /**
   * Whether the Switch is disabled
   */
  disabled?: boolean
}

export interface AcvSwitchEvents {
  /**
   * Triggered when the modelValue is updated
   * @arg {string} eventName - The name of the event
   * @arg {string} value - Checked state of the Switch
   */
  (eventName: 'update:modelValue', value: boolean): void
}

export interface AcvSwitchSlots {
  /**
   * The default slot content
   */
  default?: (any) => any
}
