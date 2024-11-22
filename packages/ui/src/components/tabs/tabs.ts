import type { AcvTabPaneProps } from '@/components/tab-pane/tab-pane.ts';
import type { ComponentSize, TransitionProp } from '@/types/props';
import type { InjectionKey, Ref } from 'vue';

export interface AcvTabsProps {
  /**
   * Active tab
   */
  modelValue?: number | string

  /**
   * Whether tab is large
   */
  large?: boolean

  /**
   * Show divider under navigation
   */
  showDivider?: boolean

  /** Disable margins navigation panel */
  spacing?: boolean

  /**
   * Size of the tabs
   */
  size?: ComponentSize

  /**
   * Tab transition
   */
  transition?: TransitionProp
}

export interface AcvTabsEvents {
  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} value - The name of the active tab
   */
  (eventName: 'update:modelValue', value: AcvTabsProps['modelValue']): void
  /**
   * Triggered when the tab is clicked
   * @arg {string} eventName - The name of the event
   * @arg {string} tabName - Clicked tab
   */
  (eventName: 'click', tabName: string): void

  /**
   * Triggered when the tab is clicked
   * @arg {string} eventName - The name of the event
   * @arg {string} tabName - Clicked tab
   */
  (eventName: 'tabClick', tabName: string): void

  /**
   * Triggered when the component is closed
   * @arg {string} eventName - The name of the event
   * @arg {string} visible - The visibility state of the component
   */
  (eventName: 'close', visible: boolean): void
}

export interface AcvTabsSlots {
  /**
   * The default slot content
   */
  default: () => any
  /**
   * Slot for tabs
   */
  tabs: (_: any) => any
}

export interface AcvTabsInjection {
  count?: number
  selectedIndex?: number
  selectedTab?: Ref<string | number | null> | null
  panes?: Ref<AcvTabPaneProps[]> | null
}
export const TABS_KEY = Symbol('TABS_KEY') as InjectionKey<AcvTabsInjection>;
