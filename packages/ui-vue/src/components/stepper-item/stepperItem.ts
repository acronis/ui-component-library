import type { RouteLocationRaw, RouterLink } from 'vue-router';

export interface AcvStepperItemProps {
  /**
   * Target of the link
   */
  to?: RouteLocationRaw

  /** Whether button appearance as selected */
  selected?: boolean

  /**
   * Disable the StepperItem
   */
  disabled?: boolean

  /**
   * StepperItem tag
   * @values a, span, button, label, RouterLink
   * @defaultValue button
   */
  is?: 'a' | 'span' | 'button' | 'label' | typeof RouterLink
}

export interface AcvStepperItemEvents {
  /**
   * Triggered when the component is being selected
   * @arg {string} eventName - The name of the event
   */
  (eventName: 'select'): void
}

export interface AcvStepperItemSlots {
  /**
   * The default slot content
   */
  default: void
}
