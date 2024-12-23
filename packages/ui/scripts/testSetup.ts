import { config } from '@vue/test-utils';
import { beforeEach, vi } from 'vitest';

// import { ResizeObserver } from '@juggle/resize-observer';

class IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = Object.freeze([]);

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    if (!callback && options) {
      //
    }
  }

  disconnect() {}

  observe(_target: Element) {}

  takeRecords() {
    return [];
  }

  unobserve(_target: Element) {}
}

config.global.stubs = {
  Transition: {
    inheritAttrs: false,
    setup(_, { slots }) {
      return () => slots.default?.();
    }
  },
  TransitionGroup: {
    inheritAttrs: false,
    setup(_, { slots }) {
      return () => slots.default?.();
    }
  }
};

// vi.stubGlobal('ResizeObserver', ResizeObserver);
vi.stubGlobal('IntersectionObserver', IntersectionObserver);

beforeEach(() => {
  if (typeof document !== 'undefined') {
    document.body.innerHTML = '';
    document.head.innerHTML = '';
  }
});
