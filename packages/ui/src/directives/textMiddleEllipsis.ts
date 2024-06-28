import type { Directive, DirectiveBinding, VNode } from 'vue';

const windowPathValidation = (path: string) => /^[a-z]:\\.*$/i.test(path);
const linuxPathValidation = (path: string) => /^\/|(?:\/[\w-]+)+$/.test(path);

function textMiddleEllipsis(el: HTMLElement, binding: DirectiveBinding, path: string | undefined) {
  if (path === undefined || (!windowPathValidation(path) && !linuxPathValidation(path))) {
    console.warn(`Invalid path for v-text-middle-ellipsis: "${path}"`);
    return;
  }
  el.innerHTML = '';
  const splitIndex = Math.round(path.length * 0.75);
  el.className = 'acv-text-middle-ellipsis';
  const leftSpan = document.createElement('span');
  const rightSpan = document.createElement('span');
  leftSpan.className = 'left';
  rightSpan.className = 'right';
  leftSpan.textContent = path.slice(0, splitIndex);
  rightSpan.textContent = path.slice(splitIndex);

  if (binding.arg === 'show-hover-hint') {
    el.setAttribute('title', path);
  }
  el.appendChild(leftSpan);
  el.appendChild(rightSpan);
}

export const vTextMiddleEllipsis: Directive = {
  updated(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
    textMiddleEllipsis(
      el,
      binding,
      Array.isArray(vnode.children)
        ? (vnode.children[0] as any)?.textContent?.trim()
        : undefined
    );
  },
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    textMiddleEllipsis(el, binding, el.textContent?.trim());
  }
};
