import type { DirectiveBinding } from 'vue';

type IntersectionCallback = (entry: IntersectionObserverEntry) => void;

const observeMap = new WeakMap<HTMLElement, IntersectionObserver>();

function mount(el: HTMLElement, value: IntersectionCallback) {
  const observer = new IntersectionObserver(([entry]) => value(entry));

  observeMap.set(el, observer);
  observer.observe(el);
}

function unmount(el: HTMLElement) {
  observeMap.get(el)?.disconnect();
  observeMap.delete(el);
}

export const vIntersect = {
  mounted(el: HTMLElement, binding: DirectiveBinding<IntersectionCallback>) {
    mount(el, binding.value);
  },
  unmounted(el: HTMLElement) {
    unmount(el);
  },
};
