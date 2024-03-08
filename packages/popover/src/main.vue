<template>
  <span>
    <transition
      :name="transition"
      @after-leave="doDestroy"
    >
      <div
        v-show="!disabled && showPopper"
        :id="tooltipId"
        ref="popper"
        class="el-popover el-popper"
        :class="[popperClass]"
        :style="{ width: width + 'px' }"
        role="tooltip"
        :aria-hidden="(disabled || !showPopper) ? 'true' : 'false'"
        @keydown.esc="handleEsc"
        @keydown.tab="handleKeydown"
      >
        <div
          v-if="loading && !$slots.default"
          v-loading="loading"
          class="el-popover__loading"
          el-loading-size="32"
        />
        <div
          ref="resizableContainer"
          v-loading="loading"
          el-loading-size="32"
          el-loading-background="fixed-white"
          el-loading-opacity=".8"
          class="el-popover__wrap"
        >
          <slot />
          <div
            v-if="$slots.actions"
            class="el-alert__actions mx-16"
          >
            <slot name="actions" />
          </div>
        </div>
      </div>
    </transition>
    <div ref="referenceWrapper">
      <slot name="reference" />
    </div>
  </span>
</template>
<script>
  import Popper from '@/utils/vue-popper';
  import HidePopper from '@/mixins/hidePopper';
  import Loading from 'packages/loading/src/directive';
  import { generateId } from '@/utils/util';
  import ResizeObserver from 'resize-observer-polyfill';

  let on, off, addClass;

  export default {
  name: 'ElPopover',

  directives: {
    loading: Loading
  },

  mixins: [HidePopper, Popper],

  props: {
    trigger: {
      type: String,
      default: 'click',
      validator: (value) => ['click', 'focus', 'hover', 'manual'].indexOf(value) > -1
    },
    openDelay: {
      type: Number,
      default: 0
    },
    disabled: Boolean,
    loading: Boolean,
    reference: {},
    popperClass: String,
    width: {},
    visibleArrow: {
      type: Boolean,
      default: false
    }, // TODO: deprecated code, remove in next release
    pointer: {
      type: String,
      default: 'none'
    },
    transition: {
      type: String,
      default: 'fade-in-linear'
    }
  },
  emits: ['show', 'hide'],

  data: () => ({
    nestedPopovers: [],
    observer: null
  }),

  computed: {
    tooltipId() {
      return `el-popover-${generateId()}`;
    }
  },
  watch: {
    showPopper(val) {
      val ? this.$emit('show') : this.$emit('hide');
    }
  },

  created() {
    eventBus.$on('el.popover.create.nested', (nestedPopover) => {
      if (nestedPopover !== this.$refs.popover) {
        this.nestedPopovers.push(nestedPopover);
      }
    });
    eventBus.$on('el.popover.destroy.nested', (nestedPopover) => {
      const index = this.nestedPopovers.indexOf(nestedPopover);
      this.nestedPopovers.splice(index, 1);
    });
    eventBus.$on('onHidePopper', this.doHidePoppers);
  },

  beforeMount() {
    import('@/utils/dom').then((module) => {
      const DomUtilities = module.default;
      on = DomUtilities.on;
      off = DomUtilities.off;
      addClass = DomUtilities.addClass;
    });
  },

  mounted() {
    this.nestedPopovers.forEach((popover) => {
      popover.doDestroy();
    });
    // eslint-disable-next-line no-multi-assign
    let reference = this.referenceElm = this.reference || this.$refs.reference;
    const popper = this.popper || this.$refs.popper;

    if (!reference) {
      // eslint-disable-next-line no-multi-assign
      reference = this.referenceElm = this.$refs.referenceWrapper;
      eventBus.$emit('el.popover.create.nested', this);
      // this.dispatch('ElPopover', 'createNestedPopover', this);
    }
    if (reference) {
      addClass(reference, 'el-popover__reference');
      reference.setAttribute('aria-describedby', this.tooltipId);
      reference.setAttribute('tabindex', '0');
      popper.setAttribute('tabindex', '0');
      this.updatePopper();
    }
    if (this.trigger !== 'click') {
      on(reference, 'focusin', this.handleFocus);
      on(popper, 'focusin', this.handleFocus);
      on(reference, 'focusout', this.handleBlur);
      on(popper, 'focusout', this.handleBlur);
    }
    on(reference, 'keydown', this.handleKeydown);

    if (this.trigger === 'click') {
      on(reference, 'click', this.doToggle);
      document.addEventListener('click', this.handleDocumentClick, true);
    } else if (this.trigger === 'hover') {
      on(reference, 'mouseenter', this.handleMouseEnter);
      on(popper, 'mouseenter', this.handleMouseEnter);
      on(reference, 'mouseleave', this.handleMouseLeave);
      on(popper, 'mouseleave', this.handleMouseLeave);
    } else if (this.trigger === 'focus') {
      if (reference.querySelector('input, textarea')) {
        on(reference, 'focusin', this.doShow);
        on(reference, 'focusout', this.doClose);
      } else {
        on(reference, 'mousedown', this.doShow);
        on(reference, 'mouseup', this.doClose);
      }
    }

    const observer = new ResizeObserver(this.onResize);
    observer.observe(this.$refs.resizableContainer);
    this.observer = observer;
  },

  beforeUnmount() {
    this.observer && this.observer.disconnect();
  },

  unmounted() {
    const reference = this.reference;

    off(reference, 'click', this.doToggle);
    off(reference, 'mouseup', this.doClose);
    off(reference, 'mousedown', this.doShow);
    off(reference, 'focus', this.doShow);
    off(reference, 'blur', this.doClose);
    off(reference, 'mouseleave', this.handleMouseLeave);
    off(reference, 'mouseenter', this.handleMouseEnter);
    document.removeEventListener('click', this.handleDocumentClick, true);
  },

  methods: {
    onResize() {
      this.updatePopper();
    },
    doToggle() {
      this.showPopper = !this.showPopper;
    },
    doShow() {
      this.showPopper = true;
    },
    doClose() {
      this.showPopper = false;
    },
    handleFocus() {
      if (this.trigger !== 'manual') {
        this.showPopper = true;
      }
    },
    handleBlur() {
      if (this.trigger !== 'manual') {
        this.showPopper = false;
      }
    },
    handleMouseEnter() {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.showPopper = true;
      }, this.openDelay);
    },
    handleKeydown() {
      if (this.showPopper && this.$refs.popper) {
        this.$refs.popper.focus();
      }
    },
    handleEsc(ev) {
      if (ev.keyCode === 27 && this.trigger !== 'manual') {
        const reference = this.$refs.reference || this.$refs.referenceWrapper;
        if (reference.parentNode.children[2]) {
          reference.parentNode.children[2].focus();
          this.doClose();
        } else {
          this.doClose();
        }
      }
    },

    handleMouseLeave() {
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.showPopper = false;
      }, 200);
    },
    handleDocumentClick(e) {
      let reference = this.reference || this.$refs.reference;
      const popper = this.popper || this.$refs.popper;

      if (!reference && this.$slots.reference && this.$slots.reference()[0]) {
        // eslint-disable-next-line no-multi-assign
        reference = this.referenceElm = this.$refs.referenceWrapper;
      }
      if (!this.$el
          || !reference
          || this.$el.contains(e.target)
          || reference.contains(e.target)
          || !popper
          || popper.contains(e.target)) return;

      if (this.nestedPopovers.every((popover) => !popover.showPopper)) {
        this.showPopper = false;
      }
    },
    doHidePoppers() {
      this.showPopper = false;
      this.nestedPopovers.forEach((popover) => {
        // eventBus.$emit('onHidePopper');
        popover.$emit('onHidePopper');
      });
    }
  }
};
</script>