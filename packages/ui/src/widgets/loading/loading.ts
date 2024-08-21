import type { ColorProp, ComponentSize } from '@/types/props.ts';

export interface AcvLoadingProps {
  /**
   * Loading visibility state
   * @defaultValue false
   */
  modelValue?: boolean

  /**
   * Whether the Loading is fullscreen
   * @defaultValue false
   */
  fullscreen?: boolean

  /**
   * Backdrop background color
   * @defaultValue 'primary'
   */
  background?: ColorProp | boolean

  /**
   * Opacity of the backdrop background
   * @defaultValue 0.5
   */
  opacity?: number

  /**
   * Color of the spinner
   * @defaultValue 'primary'
   */
  color?: ColorProp

  /**
   * Size of the spinner
   * @defaultValue 'medium'
   */
  size?: ComponentSize

  /**
   * Title of the loading
   */
  title?: string

  /**
   * Description of the loading
   */
  description?: string

  /**
   * Loading title and description color
   */
  textColor?: string
}

export interface AcvLoadingEvents {
  /**
   * Triggered when the transition wrapper emits a 'afterLeave' event
   * @param eventName
   */
  (eventName: 'afterLeave'): void
}

export interface AcvLoadingSlots {
  /**
   * Title slot content
   */
  title?: () => NonNullable<unknown>

  /**
   * The description slot content
   * @binding {string} description - The description prop value
   */
  description?: () => NonNullable<unknown>
}
