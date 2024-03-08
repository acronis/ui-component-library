let on;

const nodeList = [];
const ctx = '@@clickoutsideContext';

let startClick;
let seed = 0;

function createDocumentHandler(el, binding, vnode) {
  return function (mouseup = {}, mousedown = {}) {
    if (!vnode || !vnode.context) return;
    if (!mouseup.target || !mousedown.target) return;
    let mouseupTarget;
    let mousedownTarget;
    if (mouseup.target) {
      mouseupTarget = mouseup.target;
      if (mouseup.composedPath && mouseupTarget !== mouseup.composedPath()[0]) {
        [mouseupTarget] = mouseup.composedPath();
      }
      if (el === mouseupTarget || el.contains(mouseupTarget)) return;
    }
    if (mousedown.target) {
      mousedownTarget = mousedown.target;
      if (mousedown.composedPath && mousedownTarget !== mousedown.composedPath()[0]) {
        [mouseupTarget] = mouseup.composedPath();
      }
      if (el === mousedownTarget || el.contains(mousedownTarget)) return;
    }
    if (vnode.context.popperElm) {
      if (vnode.context.popperElm.contains(mouseupTarget)) return;
      if (vnode.context.popperElm.contains(mousedownTarget)) return;
    }
    if (binding.expression
      && el[ctx].methodName
      && vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName]();
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn();
    }
  };
}

/**
 * v-clickoutside
 * @desc Events that are triggered only when the outside of the element is clicked
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  beforeMount(el, binding, vnode) {
    import('@/utils/dom').then((module) => {
      on = module.default.on;
    });
    on(document, 'mousedown', (e) => { startClick = e; });
    on(document, 'mouseup', (e) => {
      nodeList.forEach((node) => node[ctx].documentHandler(e, startClick));
    });

    nodeList.push(el);
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value,
      iFrameListener: () => {
        if (document && document.activeElement && document.activeElement.tagName === 'IFRAME'
          && typeof binding.value === 'function') {
          binding.value();
        }
      }
    };
    window.addEventListener('blur', el[ctx].iFrameListener);
  },

  updated(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
    el[ctx].methodName = binding.expression;
    el[ctx].bindingFn = binding.value;
  },

  unmounted(el) {
    const len = nodeList.length;

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        break;
      }
    }
    window.removeEventListener('blur', el[ctx].iFrameListener);
    delete el[ctx];
  }
};
