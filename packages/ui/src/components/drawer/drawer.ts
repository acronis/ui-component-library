import type { AcvCardProps } from '../card/card.ts';

export type AcvDrawerAnchor = 'left' | 'right' | 'top' | 'bottom';

export interface AcvDrawerProps extends AcvCardProps {
  /**
   * Drawer visiblity state
   */
  modelValue?: boolean

  /**
   * Persistence of drawer when clicked outside of reference element
   */
  persistent?: boolean

  /**
   * Drawer anchor/position
   * @defaultValue 'left'
   */
  anchor?: AcvDrawerAnchor
}

export interface AcvDrawerEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'update:modelValue', visible: boolean): void
}

export interface AcvDrawerSlots {}
