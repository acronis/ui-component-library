import { createApp, nextTick, defineComponent } from 'vue';

import afterLeave from '@/utils/after-leave';

let addClass, removeClass, getStyle;

import Loading from './loading.vue';

const directive = function () {
  const isElementVisible = (el) => !el.domVisible && getStyle(el, 'display') !== 'none' && getStyle(el, 'visibility') !== 'hidden';

  const isModifiersAllowed = (modifiers) => !modifiers.fullscreen && !modifiers.lock && !modifiers.body;

  const insertDom = (parent, el, binding) => {
    if (isElementVisible(el) || isModifiersAllowed(binding.modifiers)) {
      // binding.modifiers.parent = parent;

      Object.keys(el.maskStyle).forEach((property) => {
        el.mask.style[property] = el.maskStyle[property];
      });

      if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed') {
        addClass(parent, 'el-loading-parent--relative');
      }
      if (binding.modifiers.fullscreen && binding.modifiers.lock) {
        addClass(parent, 'el-loading-parent--hidden');
      }
      el.domVisible = true;

      parent.appendChild(el.mask);
      nextTick(() => {
        if (el.instance.hiding) {
          el.instance.$emit('after-leave');
        } else {
          el.instance.visible = true;
        }
      });
      el.domInserted = true;
    } else if (el.domVisible && el.instance.hiding === true) {
      el.instance.visible = true;
      el.instance.hiding = false;
    }
  };
  const toggleLoading = (el, binding) => {
    if (binding.value) {
      nextTick(() => {
        if (binding.modifiers.fullscreen) {
          el.originalPosition = getStyle(document.body, 'position');
          el.originalOverflow = getStyle(document.body, 'overflow');

          addClass(el.mask, 'is-fullscreen');
          insertDom(document.body, el, binding);
        } else {
          removeClass(el.mask, 'is-fullscreen');

          if (binding.modifiers.body) {
            el.originalPosition = getStyle(document.body, 'position');

            ['top', 'left'].forEach((property) => {
              const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
              el.maskStyle[property] = `${el.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll]}px`; // eslint-disable-line max-len
            });
            ['height', 'width'].forEach((property) => {
              el.maskStyle[property] = `${el.getBoundingClientRect()[property]}px`;
            });

            insertDom(document.body, el, binding);
          } else {
            el.originalPosition = getStyle(el, 'position');
            if (el.classList?.length && [...el.classList].some((className) => {
              // Storybook issue : className is DomTokenList[] (object)
              if (typeof className === 'string' && className.startsWith('el-dialog')) {
                return true;
              }
              return !!(className.value && className.value.startsWith('el-dialog'));
            })) {
              insertDom(el.querySelector('.el-dialog'), el, binding);
            } else {
              insertDom(el, el, binding);
            }
          }
          Object.keys(el.attributes)
            .map((key) => {
              const { name } = el.attributes[key];
              return name.indexOf('el-loading') > -1 ? el.attributes[key].name : null;
            })
            .forEach((item) => el.removeAttribute(item));
        }
      });
    } else {
      const target = binding.modifiers.parent
      || binding.modifiers.fullscreen
      || binding.modifiers.body
        ? document.body
        : el;
      afterLeave(el.instance, () => {
        if (!el.instance.hiding) return;
        el.domVisible = false;
        removeClass(target, 'el-loading-parent--relative');
        removeClass(target, 'el-loading-parent--hidden');
        el.instance.hiding = false;
      }, 300, true);

      el.instance.visible = false;
      el.instance.hiding = true;
    }
  };

  const getBindData = (el, binding) => {
    const {
      background, opacity, color, size, text, textColor
    } = binding.value || {};
    const dataFromAttributes = {
      background: background || el.getAttribute('el-loading-background'),
      opacity: opacity || el.getAttribute('el-loading-opacity'),
      color: color || el.getAttribute('el-loading-color'),
      size: size || el.getAttribute('el-loading-size'),
      text: text || el.getAttribute('el-loading-text'),
      textColor: textColor || el.getAttribute('el-loading-text-color')
    };
    Object.keys(dataFromAttributes).forEach((key) => {
      if (!dataFromAttributes[key]) {
        delete dataFromAttributes[key];
      }
    });
    return dataFromAttributes;
  };

  return {
    beforeMount(el, binding) {
      import('@/utils/dom').then((module) => {
        const DomUtilities = module.default;
        addClass = DomUtilities.addClass;
        removeClass = DomUtilities.removeClass;
        getStyle = DomUtilities.getStyle;
      });
      const Mask = defineComponent({
        extends: Loading,
        data() {
          return {
            fullscreen: !!binding.modifiers.fullscreen,
            ...getBindData(el, binding)
          };
        }
      });

      const maskInstance = createApp(Mask);
      const mask = maskInstance.mount(document.createElement('div'));

      el.maskInstance = maskInstance;
      el.instance = mask;
      el.mask = mask.$el;
      el.maskStyle = {};

      binding.value && toggleLoading(el, binding);
    },

    updated(el, binding) {
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding);
      }
      Object.assign(el.instance.$data, getBindData(el, binding));
    },

    unmounted(el, binding) {
      if (el.domInserted) {
        el.mask?.parentNode?.removeChild(el.mask);
        toggleLoading(el, { value: false, modifiers: binding.modifiers });
      }

      el.maskInstance?.unmount();
    }
  };
};

export default directive();
