import { nextTick } from 'vue';

import { createPopper } from '@popperjs/core';

import eventBus from '@/utils/eventBus';
import { PopupManager } from '@/utils/popup';

const stop = (e) => e.stopPropagation();

/**
 * @param {HTMLElement} [reference=$refs.reference] - The reference element used to position the popper.
 * @param {HTMLElement} [popper=$refs.popper] - The HTML element used as popper, or a configuration used to generate the popper.
 * @param {String} [placement=button] - Placement of the popper accepted values: top(-start, -end), right(-start, -end), bottom(-start, -end), left(-start, -end)
 * @param {Number} [offset=0] - Amount of pixels the popper will be shifted (can be negative).
 * @param {Boolean} [visible=false] Visibility of the popup element.
 * @param {Boolean} [visible-arrow=false] Visibility of the arrow, no style.
 */
export default {
  props: {
    placement: {
      type: String,
      default: 'bottom'
    },
    boundariesPadding: {
      type: Number,
      default: 5
    },
    reference: {},
    popper: {},
    offset: {
      default: 0
    },
    pointer: {
      type: String,
      default: 'none'
    },
    modelValue: Boolean,
    visibleArrow: Boolean,
    transition: String,
    appendToBody: {
      type: Boolean,
      default: true
    },
    popperOptions: {
      type: Object,
      default() {
        return {
          gpuAcceleration: false
        };
      }
    }
  },

  data() {
    return {
      showPopper: false,
      currentPlacement: '',
      arrow: false,
      greenPulse: false
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.showPopper = val;
        this.$emit('update:modelValue', val);
      }
    },

    showPopper(val) {
      val ? this.updatePopper() : this.destroyPopper();
      this.$emit('update:modelValue', val);
    },

    reference() {
      this.createPopper();
    },
    placement(value) {
      if (value !== this.currentPlacement) {
        this.currentPlacement = value;
      }
    }
  },

  methods: {
    createPopper() {
      this.currentPlacement = this.currentPlacement || this.placement;
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
        return;
      }
      const options = this.popperOptions;
      const popper = this.popperElm || this.popper || this.$refs.popper;
      this.popperElm = popper;
      let reference = this.reference || this.$refs.reference || this.referenceElm;
      this.referenceElm = reference;

      // this.dispatch('ElPopover', 'createNestedPopover', this);
      eventBus.$emit('el.popover.create.nested', this);
      // To deprecate due to it's not recommended to use vnode .elm and probably not supported in vue 3.0
      // https://github.com/vuejs/vue/issues/5427#issuecomment-294670724
      if (!reference && this.$slots?.reference) {
        reference = typeof this.$slots.reference === 'function' ? this.$slots.reference() : this.$slots.reference;
        this.referenceElm = reference;
      }

      if (this.referenceElm?.closest?.('div[data-lock]')
          && 'setAttribute' in this.$el
      ) {
        this.$el.setAttribute('data-no-focus-lock', true);
      }

      if (!popper || !reference) return;
      if (this.visibleArrow) this.appendArrow(popper);
      if (this.pointer === 'arrow') {
        this.arrow = true;
        this.appendArrow(popper);
      } else if (this.pointer === 'green-pulse') {
        this.greenPulse = true;
        this.appendGreenPulse(popper);
      }

      if (this.appendToBody) document.body.appendChild(this.popperElm);
      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy();
      }

      options.placement = this.currentPlacement;
      options.offset = this.offset;
      if (this.hideOnScroll) {
        options.hideOnScroll = this.hidePopper;
      }
      if (this.hideOnResize) {
        options.hideOnResize = this.hidePopper;
      }
      options.modifiers = [
        {
          name: 'zIndexStyle',
          enabled: true,
          phase: 'write',
          fn({ state }) {
          // TODO check modifier
            state.styles.popper.zIndex = PopupManager.nextZIndex();
          },
        }
      ];
      options.onFirstUpdate = () => {
        eventBus.$emit('el.popper.created', this); // added for dialog lock-focus
        this.$emit('created', this);
        this.resetTransformOrigin();
        nextTick(this.updatePopper);
      };
      this.popperJS = createPopper(reference, popper, options);
      this.popperElm.addEventListener('click', stop);

      // To update popper position when inner tree component collapse or expand
      this.popperElm.addEventListener('click', this.handleClick, true);
    },

    updatePopper() {
      if (this.popperJS) {
        this.popperJS.update();
        this.popperJS._popper.style.zIndex = PopupManager.nextZIndex();
      } else {
        this.createPopper();
      }
      if (this.popperElm && this.visibleArrow) this.popperElm.classList.add('el-popper--with-arrow');
      if (this.popperElm && this.arrow) this.popperElm.classList.add('el-popper--with-arrow');
      if (this.popperElm && this.greenPulse) this.popperElm.classList.add('el-popper--with-green-pulse');
    },

    doDestroy() {
      if (this.showPopper || !this.popperJS) return;
      eventBus.$emit('el.popper.destroyed', this); // added for dialog lock-focus
      this.popperJS.destroy();
      this.popperJS = null;

      eventBus.$emit('el.popover.destroy.nested', this);
      // this.dispatch('ElPopover', 'destroyNestedPopover', this);
    },

    destroyPopper() {
      if (this.referenceElm
        && this.referenceElm.closest
        && this.referenceElm.closest('div[data-lock]')
        && 'removeAttribute' in this.$el
      ) {
        this.$el.removeAttribute('data-no-focus-lock');
      }
      if (this.popperJS) {
        this.resetTransformOrigin();
      }
    },

    resetTransformOrigin() {
      const placementMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      };
      const placement = this.popperJS.state.placement.split('-')[0];
      const origin = placementMap[placement];
      // TODO useless?
      this.popperJS.state.elements.popper.style.transformOrigin = ['top', 'bottom'].indexOf(placement) > -1 ? `center ${origin}` : `${origin} center`;
    },

    appendArrow(element) {
      if (this.appended) {
        return;
      }

      this.appended = true;

      const arrow = document.createElement('div');

      arrow.setAttribute('x-arrow', '');
      arrow.className = 'el-popper__arrow';

      element.classList.add('el-popper--with-arrow');
      element.appendChild(arrow);
    },

    appendGreenPulse(element) {
      if (this.appended) {
        return;
      }
      this.appended = true;
      const arrow = document.createElement('div');
      arrow.setAttribute('x-arrow', '');
      arrow.className = 'el-popper__green-pulse';

      const container = document.createElement('div');
      container.className = 'container';
      const firstCircle = document.createElement('div');
      firstCircle.className = 'circle first';
      const secondCircle = document.createElement('div');
      secondCircle.className = 'circle second animation';
      const thirdCircle = document.createElement('div');
      thirdCircle.className = 'circle third animation';

      arrow.appendChild(container);
      container.append(firstCircle, secondCircle, thirdCircle);
      element.classList.add('el-popper--with-green-pulse');
      element.appendChild(arrow);
    },

    handleClick() {
      nextTick(() => {
        this.updatePopper();
      });
    }
  },

  beforeUnmount() {
    this.doDestroy();
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener('click', stop);
      document.body.removeChild(this.popperElm);
    }
  },

  // call destroy in keep-alive mode
  deactivated() {
    this.$options.beforeUnmount[0].call(this);
  }
};
