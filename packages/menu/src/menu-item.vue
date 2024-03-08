<template>
  <li
    class="el-menu-item"
    :class="{
      'is-active': active,
      'is-disabled': disabled,
      'is-focus': focused,
      'is-root': isRoot,
      'is-multiline': multiline,
      [`multiline-limit--${multilineLimit}`]: multiline && multilineLimit
    }"
    role="menuitem"
    :tabindex="disabled ? -1 : 0"
    :title="title()"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown.enter="handleClick"
  >
    <el-tooltip
      v-if="$parent === rootMenu && rootMenu.collapse"
      placement="right"
    >
      <template #content>
        <div
          v-if="$slots.title"
        >
          <slot name="title" />
        </div>
      </template>
      <span
        v-if="$slots.icon"
        class="el-menu__bar-icon"
      ><slot name="icon" /></span>
    </el-tooltip>
    <template v-else>
      <span
        v-if="$slots.icon"
        class="el-menu__bar-icon"
      >
        <slot name="icon" />
      </span>
      <span
        v-if="$slots.title || $slots.subtitle"
        class="el-menu-item__content"
      >
        <div
          v-if="$slots.title"
          class="el-menu-item__title el-text el-text--body-24 el-text--ellipsis"
        >
          <slot name="title" />
        </div>
        <div
          v-if="$slots.subtitle"
          class="el-menu-item__subtitle el-text--caption el-text--ellipsis el-text--color-fixed-light"
        >
          <slot name="subtitle" />
        </div>
      </span>
      <div class="el-text el-text--body-24 el-text--ellipsis">
        <slot />
      </div>
    </template>
    <el-tag
      v-if="counter"
      :type="counterType"
      class="ml-8"
    >
      {{ counter }}
    </el-tag>
    <span
      v-if="active"
      class="el-active-indicator"
      :style="{bottom: activeTabStyleBottom}"
    />
    <span
      v-if="$slots['right-icon']"
      class="el-menu-item__right-icon mr-8 ml-16"
    >
      <slot name="right-icon" />
    </span>
  </li>
</template>
<script>
import pathToRegexp from 'path-to-regexp';
import NodeText from '@/mixins/node-text';
import eventBus from '@/utils/eventBus';

import Menu from './menu-mixin';

export default {
  name: 'ElMenuItem',

  componentName: 'ElMenuItem',

  mixins: [Menu, NodeText],

  props: {
    index: {
      type: String,
      required: true
    },
    multiline: {
      type: Boolean,
      default: false
    },
    multilineLimit: {
      type: Number,
      validator: (value) => [2, 3].indexOf(value) > -1
    },
    route: {
      type: [String, Object],
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    exact: Boolean,
    showHoverHint: {
      type: Boolean,
      default: false
    },
    counter: {
      type: Number,
      default: 0
    },
    counterType: {
      type: String,
      default: 'info'
    }
  },

  emits: ['click', 'mousedown', 'mouseup'],

  data: () => ({
    focused: false,
    isClick: false
  }),

  computed: {
    active() {
      // TODO: maybe this and the exact prop can be removed
      if (this.rootMenu.router && !this.exact) {
        const re = this.index[0] === '/' ? pathToRegexp(`${this.index}/:foo*`) : pathToRegexp(`/:foo*/${this.index}`);
        return re.test(this.rootMenu.activeIndex);
      }
      return this.index === this.rootMenu.activeIndex;
    },
    mode() {
      return this.rootMenu.mode;
    },
    isNested() {
      return this.parentMenu !== this.rootMenu;
    },
    activeTabStyleBottom() {
      return `-${(parseInt(this.$parent.computedHeight, 10) - 32) / 2}px`;
    }
  },
  created() {
    this.parentMenu.addItem(this);
    this.rootMenu.addItem(this);
  },
  beforeUnmount() {
    this.parentMenu.removeItem(this);
    this.rootMenu.removeItem(this);
  },
  methods: {
    handleClick() {
      if (this.disabled) {
        return;
      }

      eventBus.$emit('el.menu.item.click', this);

      this.$emit('click', this);
      // TODO add unit test
      this.$parent.$children.forEach((element) => {
        if (element.$options.name === 'ElSubmenu' && element.opened) {
          eventBus.$emit('el.menu.submenu.click', element);
        }
      });
    },

    handleBlur() {
      this.focused = false;
      this.isClick = false;
      this.$nextTick(() => {
        if (!this.rootMenu.$el.contains(document.activeElement)) {
          this.rootMenu.prevFocusItem = null;
        }
      });
    },

    handleMouseDown() {
      this.isClick = !this.disabled;
      if (this.disabled) {
        return;
      }
      this.$emit('mousedown', this.index);
    },

    handleMouseUp() {
      if (this.disabled) {
        return;
      }
      this.$emit('mouseup', this.index);
    },

    handleFocus(e) {
      if (this.disabled) {
        return;
      }

      if (!this.isClick && this.rootMenu.prevFocusItem !== e.target) {
        this.focused = true;
      } else {
        this.isClick = false;
      }
      this.rootMenu.prevFocusItem = e.target;
    },

    title() {
      if (this.$parent === this.rootMenu && this.rootMenu.collapse) {
        return null;
      }
      if (!this.showHoverHint) {
        return null;
      }
      const titleSlots = this.$slots.title;
      const defaultSlots = this.$slots.default;
      if (titleSlots) {
        return this.getSlotTextContent(titleSlots());
      }
      if (defaultSlots) {
        return this.getSlotTextContent(defaultSlots());
      }
      return null;
    }
  }
};
</script>
