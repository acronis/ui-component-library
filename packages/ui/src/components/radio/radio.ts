import type { ColorProp, ComponentSize } from '@/types/props.ts';

export interface AcvRadioProps {
  /**
   * Binding value of the Radio
   */
  modelValue: string | number | boolean

  /**
   * Radio size
   * @defaultValue medium
   */
  size?: ComponentSize

  /**
   * Custom color of the Radio
   * @defaultValue primary
   */
  color?: ColorProp

  /**
   * Label text
   */
  label?: string

  /**
   * Disable radio
   */
  disabled?: boolean

  /**
   * Whether the Radio is invalid
   */
  invalid?: boolean
}

export interface AcvRadioEvents {
  /**
   * Triggered when binding value changes
   * @arg {string} eventName - The name of the event
   * @arg {string} value - The updated value
   */
  (eventName: 'update:modelValue', value: any): void
}

export interface AcvRadioSlots {
  /**
   * The default slot content
   */
  default?: void
}
