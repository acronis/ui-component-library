import type { InjectionKey, ModelRef } from 'vue';

export interface AcvCarouselProps {
  /**
   * Indicates whether the cycle option is enabled.
   */
  cycle?: boolean
  /**
   * Whether Carousel plays automatically
   */
  autoplay?: boolean
  /**
   * Interval when autoplay is true in milliseconds
   */
  interval?: number
}

export interface AcvCarouselSlots {
  default: void
  prev?: (props: {
    prev: () => void
    disabled: boolean
  }) => void
  next?: (props: {
    next: () => void
    disabled: boolean
  }) => void
}

export interface AcvCarouselInjection {
  model: ModelRef<string | number | undefined>
  register: (name: string | number) => void
  unregister: (name: string | number) => void
}

export const CAROUSEL_INJECTION_KEY = Symbol('CAROUSEL_INJECTION_KEY') as InjectionKey<AcvCarouselInjection>;
