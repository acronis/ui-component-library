<template>
  <button
    :title="title()"
    :autofocus="autofocus"
    :disabled="disabled"
    :type="nativeType"
    :class="[
      'el-button',
      type ?`qa-button-${type}`: '',
      type ? `el-button--${type}` : '',
      buttonSize ? `el-button--${buttonSize}` : '',
      fluid && height ? `el-button--height-${fluidHeight}` : '',
      {
        'el-button--has-icon': icon,
        'el-button--contains-icon': containsIcon,
        'el-button--icon-only': iconOnly,
        'is-disabled': disabled,
        'is-loading': loading,
        'is-fluid': fluid,
        'is-multiline': multiline,
        'is-inverse': inverse,
        'is-active': isActive,
        'is-focus': isFocus
      },
    ]"
    @keydown.enter="handleEnterKeyDown"
    @keyup.enter="handleEnterKeyUp"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
    @touchend="handleTouchend"
  >
    <el-spinner
      v-if="loading"
      :color="loadingColor"
      size="sm"
    />
    <span class="el-button__content qa-button-content">
      <span
        v-if="icon && !rightIcon"
        class="qa-button-icon el-button__icon"
      >
        <el-icon
          :name="icon"
        />
      </span>
      <span class="qa-button-text el-button__text">
        <!-- @slot Default slot to render the contents to show inside the button -->
        <slot />
      </span>
      <span
        v-if="icon && rightIcon"
        class="qa-button-right-icon el-button__icon el-button--right-icon"
      >
        <el-icon
          right
          :name="icon"
        />
      </span>
    </span>
  </button>
</template>

<script>
import ElIcon from 'packages/icon';
import ElSpinner from 'packages/spinner';
import NodeText from '@/mixins/node-text';
import TabFocusable from '@/mixins/tab-focusable';

export default {
  name: 'ElButton',

  components: {
    ElIcon,
    ElSpinner
  },

  mixins: [NodeText, TabFocusable],

  inject: {
    elFormItem: {
      default: ''
    }
  },

  props: {
    /**
       * button type
       * @values primary, secondary, success, danger, ghost, promo, translucent
       */
    type: {
      type: String,
      default: 'primary'
    },
    /**
       * same as native button's `type`
       * @values button, submit, reset
       */
    nativeType: {
      type: String,
      default: 'button'
    },
    /** icon name */
    icon: {
      type: String
    },
    /** whether to show browser default hint when hover */
    showHoverHint: {
      type: Boolean,
      default: false
    },
    /**
       * height for fluid variant
       * @values 32, 48
       */
    height: {
      type: String,
      default: '32'
    },
    /** to determine if icon is on left or right for ghost button */
    rightIcon: Boolean,
    /**
       * button size
       * @values small, large
       */
    size: String,
    /**
      * same as native button's `autofocus`
      */
    autofocus: Boolean,
    /** disable the button */
    disabled: Boolean,
    /** determine whether it's loading */
    loading: Boolean,
    /** determine whether it's may take all free width */
    fluid: Boolean,
    /** whatever button is multiline */
    multiline: Boolean,
    /** inverse button colors */
    inverse: Boolean
  },

  emits: ['click'],

  data: () => ({
    containsIcon: false,
    iconOnly: false
  }),

  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },

    buttonSize() {
      return this.size || this._elFormItemSize;
    },

    fluidHeight() {
      return this.height;
    },

    loadingColor() {
      switch (this.type) {
        case 'primary':
        case 'success':
        case 'danger':
          return 'fixed-white';
        default:
          return '';
      }
    }
  },

  mounted() {
    this.containsIcon = this.slotContains(this.$slots.default, 'ElIcon');
    let iconOnly = !this.$slots.default;
    if (this.$slots.default) {
      const hasContent = this.$slots.default().find((node) => {
        return (!Array.isArray(node.children) && !node.children?.trim().length) || ['i', 'img'].includes(node.type);
      });
      iconOnly = iconOnly || !!hasContent;
    }
    this.iconOnly = iconOnly;
  },

  methods: {
    handleClick(event) {
      // no click event if loading
      if (this.loading) {
        return;
      }
      /**
         * Click event.
         *
         * @event click
         * @property {string} event name
         * @property {object} content of the first prop passed to the event
         * @type {Event}
         */
      if (!('ontouchend' in document.documentElement)) {
        this.$emit('click', event);
      }
    },

    handleTouchend(event) {
      // no click event if loading
      if (this.loading) {
        return;
      }
      this.$emit('click', event);
    },

    title() {
      if (!this.showHoverHint) return null;
      if (typeof this.$attrs.title === 'string') {
        return this.$attrs.title;
      }

      return this.$slots.default && this.getSlotChildrenText(this.$slots.default?.() || null);
    },

    getSlotChildrenText(children) {
      return children?.map((node) => {
        if (!node.children || typeof node.children === 'string') return node.children || '';
        if (Array.isArray(node.children)) return this.getSlotChildrenText(node.children);
        if (node.children.default) return this.getSlotChildrenText(node.children.default());
        return '';
      }).join('');
    },

    slotContains(slot, componentName) {
      if (!slot) {
        return false;
      }
      const slotValue = slot();
      const isContain = slotValue.find((component) => component.type?.name === componentName);
      return !!isContain;
    }
  }
};
</script>
