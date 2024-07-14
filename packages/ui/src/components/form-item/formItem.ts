import type { IconProp } from '../../types/props.ts';

type componentDirections = 'left' | 'right' | 'top' | 'bottom';

export interface AcvFormItemProps {
  /**
   * Title of the FormItem
   */
  title?: string

  control?: IconProp

  /**
   * Placement of the title
   * @values left, right
   * @defaultValue right
   */
  titlePlacement?: componentDirections
}

export interface AcvFormItemEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvFormItemSlots {
  /**
   * The default slot content
   */
  default: void
}
