<template>
  <el-dialog-mask
    v-show="visible"
    ref="mask"
    :scrollable="isFixedHeight"
    :scroll-axis="outerScrollbarAxis"
    :fix-width="isFixedWidth"
    :position="position"
    @mask-mousedown="handleWrapperClick"
  >
    <div
      ref="dialog"
      class="el-dialog qa-dialog"
      :class="dialogClasses"
      :style="dialogStyles"
    >
      <lock-focus
        v-if="rendered && visible"
        ref="lock-focus"
      >
        <el-dialog-content
          ref="content"
          :title="title"
          :variant="variant"
          :color="color"
          :show-close="showClose"
          :with-scrollbar="withScrollbar"
          @close="handleClose"
        >
          <template
            v-for="(slot) of Object.keys($slots)"
            #[slot]="scope"
          >
            <slot
              v-if="slot"
              :name="slot"
              v-bind="scope"
            />
          </template>
        </el-dialog-content>
      </lock-focus>
    </div>
  </el-dialog-mask>
</template>

<script>
import eventBus from '@/utils/eventBus';
import Popup from '@/utils/popup/index';
import { cssLengthValidator } from '@/utils/validators';

import ElDialogContent from './content.vue';
import ElDialogMask from './mask.vue';
import {
  DialogHeight, DialogPosition, DialogType, DialogWidth
} from './dialog.types';
import LockFocus from './lock-focus.vue';

export default {
  name: 'ElDialog',

  components: {
    LockFocus,
    ElDialogContent,
    ElDialogMask
  },

  mixins: [Popup],

  props: {
    variant: {
      /**
         * default: the default dialog
         * clean: the clean dialog
         * clean-basic: the clean dialog, without paddings and fade edges
         */
      type: String,
      default: DialogType.DEFAULT,
      validator: (value) => Object.values(DialogType).indexOf(value) !== -1
    },

    position: {
      type: String,
      default: DialogPosition.TOP
    },

    color: {
      type: String,
      default: ''
    },

    title: {
      type: String,
      default: ''
    },

    modal: {
      type: Boolean,
      default: true
    },

    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: false
    },

    lockScroll: {
      type: Boolean,
      default: true
    },

    closeOnClickModal: {
      type: Boolean,
      default: true
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true
    },

    showClose: {
      type: Boolean,
      default: true
    },

    top: {
      type: Number,
      default: null,
    },

    width: {
      type: String,
      default: null,
      validator: (value) => cssLengthValidator(value)
    },

    /**
       * @deprecated
       * Use widthSize and heightSize instead
       */
    size: {
      type: String,
      default: DialogWidth.SMALL
    },

    widthSize: {
      type: String,
      default: DialogWidth.SMALL,
      validator: (value) => Object.values(DialogWidth).indexOf(value) !== -1
    },

    heightSize: {
      type: String,
      default: DialogHeight.AUTO,
      validator: (value) => Object.values(DialogHeight).indexOf(value) !== -1
    },

    maxWidth: {
      type: String,
      default: undefined,
      validator: (value) => Object.values(DialogWidth).indexOf(value) !== -1
    },

    maxHeight: {
      type: String,
      default: undefined,
      validator: (value) => Object.values(DialogHeight).indexOf(value) !== -1
    },

    fullscreen: Boolean,

    customClass: {
      type: String,
      default: ''
    },

    beforeClose: Function,

    center: {
      type: Boolean,
      default: false
    },

    hideFooterWhenEmpty: {
      type: Boolean,
      default: false
    },

    withScrollbar: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close', 'update:visible', 'open'],

  data() {
    return {
      closed: false,
      isInnerScrollHeightOverflow: false,
      parentNodes: new Map()
    };
  },

  computed: {
    slotNames() {
      return Object.keys(this.$slots);
    },
    isCleanVariant() {
      return [DialogType.CLEAN, DialogType.CLEAN_BASIC].includes(this.variant);
    },
    isFullscreenVariant() {
      return this.fullscreen || this.variant === DialogType.FULLSCREEN;
    },
    hasHeader() {
      return !this.isCleanVariant && (this.$slots.title || this.title);
    },
    hasAside() {
      return !this.isCleanVariant && this.$slots.aside;
    },
    hasFooter() {
      return !this.isCleanVariant && this.$slots.footer;
    },
    hasFooterContent() {
      if (!this.$slots?.footer) {
        return false;
      }
      let hasContent = false;
      this.$slots.footer().forEach((slot) => {
        if (slot.children) {
          hasContent = true;
        }
      });
      return hasContent;
    },
    isFixedWidth() {
      return this.isCleanVariant;
    },
    isFixedHeight() {
      return [
        'fixed-auto',
        'fixed-medium'
      ].includes(this.heightSize);
    },
    outerScrollbarAxis() {
      if (this.isFixedWidth && this.isFixedHeight) {
        return '';
      }
      if (this.isFixedWidth && !this.isFixedHeight) {
        return 'x';
      }
      if (!this.isFixedWidth && this.isFixedHeight) {
        return 'y';
      }
      return 'disabled';
    },
    dialogStyles() {
      const style = {};
      if (this.width) {
        style.width = this.width;
      }
      if (!this.isFullscreenVariant) {
        // TODO test top prop
        style.marginTop = this.top;
      }

      return style;
    },
    dialogClasses() {
      const {
        center,
        customClass,
        hasFooter,
        hasFooterContent,
        hasHeader,
        hideFooterWhenEmpty,
        isCleanVariant,
        maxWidth,
        maxHeight,
        isFullscreenVariant,
        heightSize,
        widthSize
      } = this;

      return {
        'el-dialog--clean': isCleanVariant,
        'el-dialog--center': center,
        'is-no-footer': !hasFooter,
        'is-hidden-footer': hideFooterWhenEmpty && !hasFooterContent,
        'is-no-header': !hasHeader,
        [customClass]: customClass,
        'el-dialog--fullscreen': isFullscreenVariant,
        [`el-dialog--width-${widthSize}`]: widthSize && !isFullscreenVariant,
        [`el-dialog--height-${heightSize}`]: heightSize && !isFullscreenVariant,
        [`el-dialog--max-width-${maxWidth}`]: maxWidth,
        [`el-dialog--max-height-${maxHeight}`]: maxHeight
      };
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        this.$nextTick(() => {
          this.focusInside();
        });
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      } else if (!this.closed) this.$emit('close');
    }
  },

  created() {
    if (process.env.NODE_ENV !== 'production') {
      this.fullscreen && console.warn('[UI Kit Warn][Dialog]fullscreen is deprecated. Please use variant = fullscreen.');
      this.size !== DialogWidth.SMALL && console.warn('[UI Kit Warn][Dialog]size is deprecated. Please use width-size or height-size.');
      this.widthSize === DialogWidth.XLARGE && console.warn('[UI Kit Warn][Dialog]width-size x-large is deprecated. Please use width-size small, medium or large.');
    }
  },

  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
      this.$nextTick(this.focusInside);
    }
  },

  unmounted() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },

  methods: {
    handleWrapperClick(e) {
      if (!this.closeOnClickModal) return;
      // do not close on right click
      if (e.button !== undefined && e.button !== 0) return;
      this.handleClose();
    },

    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },

    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('close');
        this.closed = true;
      }
    },

    onOverflowUpdate(isHeightOverflow) {
      this.isInnerScrollHeightOverflow = isHeightOverflow;
    },

    focusInside() {
      if (!this.$refs.dialog.contains(document.activeElement) && this.$refs['lock-focus']) {
        this.$refs.content.$el.focus();
        eventBus.$emit('el.dialog.reset-scroll-position');
        // this.$refs.mask.$emit('reset-scroll-position');
      }
    }
  }
};
</script>
