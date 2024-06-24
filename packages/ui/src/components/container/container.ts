import type { ColorProps } from '../../composables/useColor.ts';
import type { ResponsibleProps } from '../../composables/useBreakpoints.ts';

export interface ContainerProps extends ResponsibleProps, ColorProps {
  /**
   * Direction for child elements
   * @values horizontal, vertical
   */
  direction?: 'horizontal' | 'vertical'
}

export interface ContainerEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface ContainerSlots {
  /**
   * The default slot content
   */
  default: void
  /**
   * The description slot content
   * @binding {string} description - The description prop value
   */
  description: void
}
