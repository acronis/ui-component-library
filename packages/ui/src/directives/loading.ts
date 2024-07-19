import { createApp, defineComponent, nextTick } from 'vue';

import Loading from '../components/loading/loading.vue';
import afterLeave from '../utils/after-leave.ts';
import { addClass, getStyle, removeClass } from '../utils/dom.ts';

// let addClass, removeClass, getStyle;

const directive = function () {
  const isElementVisible = el => !el.domVisible && getStyle(el, 'display') !== 'none' && getStyle(el, 'visibility') !== 'hidden';

  const isModifiersAllowed = modifiers => !modifiers.fullscreen && !modifiers.lock && !modifiers.body;

  const insertDom = (parent, el, binding) => {
    if (isElementVisible(el) || isModifiersAllowed(binding.modifiers)) {
      // binding.modifiers.parent = parent;

      Object.keys(el.maskStyle).forEach((property) => {
        el.mask.style[property] = el.maskStyle[property];
      });

      if (el.originalPosition !== 'absolute' && el.originalPosition !== 'fixed') {
        addClass(parent, 'acv-loading-parent--relative');
      }
      if (binding.modifiers.fullscreen && binding.modifiers.lock) {
        addClass(parent, 'acv-loading-parent--hidden');
      }
      el.domVisible = true;

      parent.appendChild(el.mask);
      nextTick(() => {
        if (el.instance.hiding) {
          el.instance.$emit('after-leave');
        }
        else {
          el.instance.visible = true;
        }
      });
      el.domInserted = true;
    }
    else if (el.domVisible && el.instance.hiding === true) {
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
        }
        else {
          removeClass(el.mask, 'is-fullscreen');

          if (binding.modifiers.body) {
            el.originalPosition = getStyle(document.body, 'position');

            ['top', 'left'].forEach((property) => {
              const scroll = property === 'top' ? 'scrollTop' : 'scrollLeft';
              el.maskStyle[property] = `${el.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll]}px`;
            });
            ['height', 'width'].forEach((property) => {
              el.maskStyle[property] = `${el.getBoundingClientRect()[property]}px`;
            });

            insertDom(document.body, el, binding);
          }
          else {
            el.originalPosition = getStyle(el, 'position');
            if (el.classList?.length && [...el.classList].some((className) => {
              // Storybook issue : className is DomTokenList[] (object)
              if (typeof className === 'string' && className.startsWith('acv-dialog')) {
                return true;
              }
              return !!(className.value && className.value.startsWith('acv-dialog'));
            })) {
              insertDom(el.querySelector('.acv-dialog'), el, binding);
            }
            else {
              insertDom(el, el, binding);
            }
          }
          Object.keys(el.attributes)
            .map((key) => {
              const { name } = el.attributes[key];
              return name.includes('acv-loading') ? el.attributes[key].name : null;
            })
            .forEach(item => el.removeAttribute(item));
        }
      });
    }
    else {
      const target = binding.modifiers.parent
        || binding.modifiers.fullscreen
        || binding.modifiers.body
        ? document.body
        : el;
      afterLeave(el.instance, () => {
        if (!el.instance.hiding)
          return;
        el.domVisible = false;
        removeClass(target, 'acv-loading-parent--relative');
        removeClass(target, 'acv-loading-parent--hidden');
        el.instance.hiding = false;
      }, 300, true);

      el.instance.visible = false;
      el.instance.hiding = true;
    }
  };

  const getBindData = (el, binding) => {
    const {
      background,
      opacity,
      color,
      size,
      text,
      textColor
    } = binding.value || {};
    const dataFromAttributes = {
      background: background || el.getAttribute('acv-loading-background'),
      opacity: opacity || el.getAttribute('acv-loading-opacity'),
      color: color || el.getAttribute('acv-loading-color'),
      size: size || el.getAttribute('acv-loading-size'),
      text: text || el.getAttribute('acv-loading-text'),
      textColor: textColor || el.getAttribute('acv-loading-text-color')
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

      if (binding.value) {
        toggleLoading(el, binding);
      }
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
