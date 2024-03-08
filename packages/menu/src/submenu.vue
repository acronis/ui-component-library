<template>
  <li
    class="el-submenu"
    :class="{
      'is-opened': opened
    }"
    :title="title()"
    role="menuitem"
  >
    <div
      ref="submenu-title"
      class="el-submenu__item"
      :class="{
        'is-root': isRoot,
        'is-active': active,
        'is-multiline': multiline,
        'is-focus': isFocus
      }"
      tabindex="0"
      @click="handleClick"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @focus="handleFocus"
      @blur="handleBlur"
      @keyup.enter="handleEnterKeyUp"
      @keydown.enter.stop.prevent="handleEnter"
    >
      <el-icon
        v-if="parent.type === 'secondary' || parent.$options.name === 'ElSubmenu'"
        class="el-submenu__arrow"
        name="i-chevron-right--16"
      />
      <span
        v-if="$slots.icon"
        class="el-menu__bar-icon"
      ><slot name="icon" /></span>
      <span class="el-text el-text--body-24 el-text--ellipsis"><slot name="title" /></span>
    </div>
    <ul
      v-show="opened"
      class="el-menu__bar"
      role="menu"
    >
      <div :class="{[`el-menu__bar--level-${level}`]: level}">
        <slot />
      </div>
    </ul>
  </li>
</template>
<script>
  import Emitter from '@/mixins/emitter';
  import NodeText from '@/mixins/node-text';
  import TabFocusable from '@/mixins/tab-focusable';
  import menuMixin from './menu-mixin';

  export default {
    name: 'ElSubmenu',

    componentName: 'ElSubmenu',

    mixins: [menuMixin, Emitter, NodeText, TabFocusable],

    props: {
      index: {
        type: String,
        required: true
      },
      multiline: {
        type: Boolean,
        default: false
      },
      showHoverHint: {
        type: Boolean,
        default: false
      }
    },

    data() {
      const parent = this.getParent('ElSubmenu') || this.getParent('ElMenu');
      return {
        items: {},
        submenus: {},
        parent,
        level: parent.level + 1
      };
    },
    computed: {
      opened() {
        return this.rootMenu.openedMenus.indexOf(this.index) > -1;
      },
      active() {
        let isActive = false;
        const submenus = this.submenus;
        const items = this.items;

        isActive = Object.keys(items).some((index) => items[index].active);

        isActive = isActive || Object.keys(submenus).some((index) => submenus[index].active);

        return isActive;
      },
      mode() {
        return this.rootMenu.mode;
      }
    },
    created() {
      this.parentMenu.addSubmenu(this);
      this.rootMenu.addSubmenu(this);
    },
    beforeUnmount() {
      this.parentMenu.removeSubmenu(this);
      this.rootMenu.removeSubmenu(this);
    },
    methods: {
      addItem(item) {
        this.$set(this.items, item.index, item);
      },
      removeItem(item) {
        delete this.items[item.index];
      },
      addSubmenu(item) {
        this.$set(this.submenus, item.index, item);
      },
      removeSubmenu(item) {
        delete this.submenus[item.index];
      },
      handleClick() {
        this.dispatch('ElMenu', 'submenu-click', this);
      },
      handleEnter() {
        this.handleEnterKeyDown();
        this.dispatch('ElMenu', 'submenu-click', this);
      },
      title() {
        if (!this.showHoverHint) {
          return null;
        }
        const titleSlots = this.$slots.title;
        const defaultSlots = this.$slots.default;
        if (titleSlots) {
          return this.getSlotTextContent(titleSlots);
        }
        if (defaultSlots) {
          return this.getSlotTextContent(defaultSlots);
        }
        return null;
      },
      getParent(componentName) {
        let component = null;
        let parent = this.$parent;
        while (parent && !component) {
          if (parent.$options.name === componentName) {
            component = parent;
          }
          parent = parent.$parent;
        }
        return component;
      }
    }
  };
</script>
