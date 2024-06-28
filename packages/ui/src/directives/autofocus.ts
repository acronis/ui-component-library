import type { Directive } from 'vue';

export const vAutofocus: Directive<HTMLElement> = {
  mounted(el, binding) {
    // skip if v-autofocus="false"
    if (binding.value !== false) {
      el.focus();
    }
  },
  updated(el, binding) {
    if (binding.value !== false) {
      el.focus();
    }
  },
};
