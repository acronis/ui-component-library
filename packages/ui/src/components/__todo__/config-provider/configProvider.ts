import type { InjectionKey, MaybeRef } from 'vue';

export interface AcvConfigProviderProps {
  /**
   * Components default props.
   * Similar to what you pass to `propsDefaults` while initializing Acronis UI Component Library plugin.
   */
  props?: NonNullable<unknown>
}

export interface AcvConfigProviderSlots {
  /**
   * The default slot content to render components affected by provided config
   */
  default: void
}

export const ACV_CONFIG_OPTIONS = Symbol('ACV_CONFIG_OPTIONS') as InjectionKey<MaybeRef<{
  props: NonNullable<unknown>
}>>;
