import type { InjectionKey } from 'vue';
import type { ComponentSize } from '../../types/props.ts';
import type { AcvButtonKind, AcvButtonVariant } from '../button/button.ts';

export interface ButtonGroupProps {
  /**
   * Size of the component
   * @values small, medium, large
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * Set of buttons that appear vertically stacked
   */
  vertical?: boolean
}

export interface ButtonState {
  index: number
  isLast: boolean
}

export interface ButtonGroupInjection {
  variant: AcvButtonVariant
  kind: AcvButtonKind
  size: ComponentSize
  increaseItem: (item: ButtonState) => void
  decreaseItem: (item: ButtonState) => void
  refreshIndexes: () => void
}
export const BUTTON_GROUP_KEY: InjectionKey<ButtonGroupInjection> = Symbol('BUTTON_GROUP_KEY');

export interface ButtonGroupEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface ButtonGroupSlots {
  /**
   * The default slot content
   */
  default: void
}
