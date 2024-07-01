import type { Directive } from 'vue';

interface ResizeCallback {
  (entry: ResizeObserverEntry): void
}

const observeMap = new WeakMap<HTMLElement, ResizeObserver>();

function mount(el: HTMLElement, value: ResizeCallback) {
  const observer = new ResizeObserver(([entry]) => value(entry));
  observeMap.set(el, observer);
  observer.observe(el);
}

function unmount(el: HTMLElement) {
  observeMap.get(el)?.disconnect();
  observeMap.delete(el);
}

export const vResize: Directive<HTMLElement, ResizeCallback | false> = {
  mounted(el, { value }) {
    if (value) {
      mount(el, value);
    }
  },
  updated(el, { value }) {
    if (!value) {
      unmount(el);
    }
    else if (!observeMap.has(el)) {
      mount(el, value);
    }
  },
  unmounted(el) {
    unmount(el);
  },
};
