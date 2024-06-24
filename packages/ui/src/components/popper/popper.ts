import type { Middleware } from '@floating-ui/vue';
// import { flip, shift } from '@floating-ui/vue';
// import type { Ref } from 'vue';
// import { sameWidthMiddleware } from './middlewares.ts';

export const transitions = [
  'fade',
  'scale',
  'slide-y',
  'slide-y-reverse',
  'scroll-y',
  'scroll-y-reverse',
  'slide-x',
  'slide-x-reverse',
  'scroll-x',
  'scroll-x-reverse',
  'view-next',
  'view-previous',
] as const;

export type AcvPopperTransitions = typeof transitions[number];

type PopperPlacementLeft = 'left' | 'left-start' | 'left-end';
type PopperPlacementTop = 'top' | 'top-start' | 'top-end';
type PopperPlacementBottom = 'bottom' | 'bottom-start' | 'bottom-end';
type PopperPlacementRight = 'right' | 'right-start' | 'right-end';
/**
 * When arrow is hidden - position means `stick to ${position} handle's edge`
 * When arrow is visible - position means `move popover's content to ${position} relative to handle's center`
 */
export type PopperPlacement =
  | PopperPlacementBottom
  | PopperPlacementRight
  | PopperPlacementTop
  | PopperPlacementLeft;

// type AFloatingMiddlewareFunc = (referenceEl: Ref<HTMLElement>, refFloating: Ref<HTMLElement>) => Middleware[];

// export const middlewareFunc: AFloatingMiddlewareFunc = (
//   referenceEl,
//   refFloating
// ) => [
//   // ℹ️ For this we need bridge to handle keep menu content open
//   // offset(6),
//
//   sameWidthMiddleware(refFloating),
//   flip(),
//   shift({ padding: 10 }),
// ];

export interface AcvPopperProps {
  /**
   * Reference element for the Popper
   * By default, it is the parent element or default slot element
   */
  referenceEl?: HTMLElement | null | undefined

  /**
   * Show/Hide Popper base on v-model value
   * @defaultValue undefined
   */
  modelValue?: boolean

  /**
   * Persistence of Popper when clicked outside of reference element
   * @defaultValue false
   */
  persist?: boolean | 'content'

  /**
   * Trigger event to open the Popper
   * @defaultValue 'click'
   * @values 'click', 'hover'
   */
  trigger?: 'click' | 'hover'

  /**
   * Delay before showing Popper
   * in milliseconds
   * @defaultValue 0
   */
  delay?: number

  /**
   * Delay before hiding Popper
   * @defaultValue 0
   */
  hideDelay?: number

  /**
   * Transition to add while showing/hiding Popper
   * @defaultValue 'fade'
   */
  transition?: AcvPopperTransitions

  /**
   * Whether the Popper is teleported
   * @defaultValue false
   */
  teleport?: boolean

  /**
   * Whether the Popper is disabled
   * @defaultValue false
   */
  disabled?: boolean

  /**
   * Width of the Popper
   */
  width?: string | number

  // Floating UI based Props
  /**
   * Placement of the Popper
   * https://floating-ui.com/docs/computePosition#placement
   * @defaultValue 'bottom-start'
   */
  placement?: PopperPlacement

  /**
   * Strategy of the appearance of the Popper
   */
  strategy?: 'absolute' | 'fixed'

  /**
   * Whether to use transform for positioning
   * https://floating-ui.com/docs/tutorial#middleware
   */
  middleware?: Middleware

  /**
   * Offset of the Popper
   * https://floating-ui.com/docs/offset
   */
  offset?: number

  /**
   * Whether to show the arrow
   * @defaultValue false
   * @value: true, false
   */
  arrow?: boolean

  /**
   * Changes the placement of the floating element to keep it in view.
   * https://floating-ui.com/docs/flip
   * @defaultValue false
   */
  flip?: boolean

  // TODO implement?
  popperClass?: string
}

export interface AcvPopperEvents {
  /**
   * Triggered when the component is toggled
   * @arg {string} eventName - The name of the event
   * @arg {boolean} value - The visibility state of the component
   */
  (eventName: 'update:modelValue', value: boolean): void

  /**
   * Triggered when the component is hidden
   * @arg {string} eventName
   */
  (eventName: 'hide'): void

  /**
   * Triggered when the component is shown
   * @param eventName
   */
  (eventName: 'show'): void
}

export interface AcvPopperSlots {
  /**
   * The default slot content, reference, anchor element
   * @binding {boolean} visible - The visibility state of the component
   * @binding {Function} close - The function to toggle the visibility state of the component
   */
  default: void

  /**
   * The content slot
   * @binding {boolean} visible - The visibility state of the component
   * @binding {Function} close - The function to close the popover
   * @binding {Function} toggle - The function to toggle the visibility state of the component
   * @binding {Function} disabled - The function to disable the popover
   */
  content: void

  /**
   *  Arrow slot content
   */
  arrow: void
}

export type AcvFloatingProps = Omit<AcvPopperProps, 'referenceEl'>;
