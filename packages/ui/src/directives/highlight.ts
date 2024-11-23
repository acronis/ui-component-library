import type { DirectiveBinding, VNode } from 'vue';
import { xssSafeHighlighter } from '@/utils/highlighter';

const highlight = function (el: HTMLElement, text: string, value: string) {
  const arr = xssSafeHighlighter.highlight(text, value);
  if (Array.isArray(arr)) {
    arr.forEach((element) => {
      if (element.className) {
        const newSpan = document.createElement('span');
        newSpan.classList.add(element.className);
        newSpan.appendChild(document.createTextNode(element.value));

        el.appendChild(newSpan);
      }
      else {
        el.appendChild(document.createTextNode(element.value));
      }
    });
  }
};

const removeChildren = function (el: HTMLElement) {
  let child = el.lastChild;
  while (child) {
    el.removeChild(child);
    child = el.lastChild;
  }
};

export const vHighlight = {
  mounted(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    removeChildren(el);
    highlight(el, Array.isArray(vnode.children) ? (vnode?.children[0] as any)?.children.trim() : [], binding.value);
  },

  updated(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    removeChildren(el);
    highlight(el, Array.isArray(vnode.children) ? (vnode?.children[0] as any)?.children.trim() : [], binding.value);
  }
};
