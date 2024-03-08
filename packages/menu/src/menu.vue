<template>
  <div
    ref="menu"
    class="el-menu"
    :class="{
      [`el-menu--${mode}`]: mode,
      [`el-menu--${type}`]: type,
      [`is-${background}`]: background,
      [`is-borderBottom`]: noBorderBottom || hideAllBorders,
      [`is-hide-all-borders`]: hideAllBorders,
      'el-menu--collapse': collapse,
      'el-menu--without-submenus': !hasSubmenus
    }"
    :style="{
      height: computedHeight,
      minHeight: computedHeight
    }"
  >
    <ul
      ref="menubar"
      class="el-menu__bar"
      role="menubar"
      :style="{
        height: computedHeight,
        minHeight: computedHeight
      }"
      @scroll="debouncedOnMenubarScroll"
    >
      <slot />
    </ul>
    <div
      v-if="mode === 'horizontal' && isOverflow"
      class="el-menu__controls"
      :class="{'is-no-gradient': hideControlGradient}"
      :style="{
        height: computedHeight,
        minHeight: computedHeight
      }"
    >
      <el-button
        type="ghost"
        @click="leftArrowHandleClick"
      >
        <el-icon name="i-chevron-left--16" />
      </el-button>
      <div class="el-menu__controls-divider" />
      <el-button
        type="ghost"
        @click="rightArrowHandleClick"
      >
        <el-icon name="i-chevron-right--16" />
      </el-button>
    </div>
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce';
import eventBus from '@/utils/eventBus';
import { addResizeListener, removeResizeListener } from '@/utils/resize-event';
import smoothScrollTo from '@/utils/smooth-scroll-to';
import { getValueByPath } from '@/utils/util';
import { getFirstComponentChild } from '@/utils/vdom';

export default {
  name: 'ElMenu',

  componentName: 'ElMenu',

  provide() {
    return {
      rootMenu: this
    };
  },

  props: {
    mode: {
      type: String,
      default: 'vertical'
    },
    type: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'tertiary'].includes(value)
    },
    modelValue: String,
    defaultActive: {
      type: String,
      default: ''
    },
    defaultOpeneds: {
      type: Array,
      default: () => []
    },
    collapse: Boolean,
    scrollIntoExpanded: {
      type: Boolean,
      default: false
    },
    uniqueOpened: {
      type: Boolean,
      default: true
    },
    router: Boolean,
    background: {
      type: String,
      validator: (value) => ['fixed-white', 'nav-primary'].includes(value)
    },
    noBorderBottom: {
      type: Boolean,
      default: false
    },
    hideAllBorders: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '64px'
    }
  },
  emits: ['open', 'close'],
  data() {
    return {
      activeIndex: null,
      openedMenus: this.defaultOpeneds.slice(0),
      items: {},
      submenus: {},
      level: 1,
      itemsList: null,
      contentWidth: 0,
      isOverflow: false,
      margin: 16,
      rightFocus: false,
      leftFocus: false,
      hideControlGradient: false,
      prevFocusItem: null
    };
  },
  computed: {
    hasSubmenus() {
      return Object.keys(this.submenus).length > 0;
    },
    isImmediateChildOfScrollbar() {
      return this.$parent.$options?.name === 'ElScrollbar';
    },
    computedHeight() {
      return this.mode === 'horizontal' ? this.height : null;
    }
  },
  watch: {
    $route(v) {
      this.updateActiveIndex(v);
    },
    items() {
      if (this.mode === 'horizontal') {
        this.$nextTick(this.updateControls);
      }
      if (this.activeIndex === null) {
        this.updateActiveIndex(this.$route);
      }
    },
    modelValue(v) {
      this.activeIndex = v;
      this.updateOpenedMenu();
    },
    defaultOpeneds(value) {
      this.openedMenus = value;
    },
    isOverflow(value) {
      if (value === false) {
        this.smoothScrollTo(0);
      }
    }
  },
  created() {
    this.debouncedOnMenubarScroll = debounce(25, this.onMenubarScroll);
  },
  mounted() {
    const { router, $route } = this;

    if (router && $route) {
      this.activeIndex = this.getActiveIndexFromRoute($route);
    } else {
      this.activeIndex = this.modelValue || this.defaultActive;
    }

    this.updateOpenedMenu();
    this.scrollToActiveItem();
    eventBus.$on('el.menu.item.click', this.handleItemClick);
    eventBus.$on('el.menu.submenu.click', this.handleSubmenuClick);

    if (this.mode === 'horizontal') {
      this.$nextTick(this.updateControls);
      addResizeListener(this.$el, this.updateControls);
    }
    if (this.isImmediateChildOfScrollbar) {
      addResizeListener(this.$el, this.$parent.requestAnimationFrameUpdate);
    }
  },
  beforeUnmount() {
    if (this.mode === 'horizontal') {
      removeResizeListener(this.$el, this.updateControls);
    }
    if (this.isImmediateChildOfScrollbar) {
      removeResizeListener(this.$el, this.$parent.requestAnimationFrameUpdate);
    }
  },
  methods: {
    onMenubarScroll() {
      if (this.mode === 'horizontal') {
        this.updateControlGradient();
      }
    },
    getActiveIndexFromRoute(route) {
      const { matched, path } = route;
      if (this.items[path]) {
        return path;
      }
      for (let i = matched.length - 1; i >= 0; i--) {
        const { path: matchedPath } = matched[i];
        if (this.items[matchedPath]) {
          return matchedPath;
        }
      }
      return null;
    },
    setActiveIndex(nextActiveIndex, indexPath) {
      this.$emit('select', nextActiveIndex, indexPath);
      // do nothing if value props is defined
      if (this.modelValue !== undefined) {
        return;
      }

      if (this.router) {
        const nextItem = this.items[nextActiveIndex];
        nextItem && this.routeToItem(nextItem);
      } else {
        this.activeIndex = nextActiveIndex;
      }
    },
    addItem(item) {
      this.items[item.index] = item;
    },
    removeItem(item) {
      delete this.items[item.index];
    },
    addSubmenu(item) {
      this.submenus[item.index] = item;
    },
    removeSubmenu(item) {
      delete this.submenus[item.index];
    },
    openMenu(index, indexPath) {
      const openedMenus = this.openedMenus;
      if (openedMenus.indexOf(index) !== -1) return;
      if (this.uniqueOpened) {
        const previousIndex = this.openedMenus[0] || null;
        this.openedMenus = openedMenus.filter((i) => indexPath.indexOf(i) !== -1);
        if (previousIndex) {
          this.$emit('close', previousIndex, [previousIndex]);
        }
      }
      this.openedMenus.push(index);
    },
    closeMenu(index) {
      const i = this.openedMenus.indexOf(index);
      if (i !== -1) {
        this.openedMenus.splice(i, 1);
      }
    },
    leftArrowHandleClick() {
      this.scrollMenu(true);
      this.leftFocus = false;
    },
    rightArrowHandleClick() {
      this.scrollMenu(false);
      this.rightFocus = false;
    },
    handleSubmenuClick(submenu) {
      const { index, indexPath } = submenu;
      const isOpened = this.openedMenus.indexOf(index) !== -1;

      if (isOpened) {
        if (this.type !== 'primary') {
          this.closeMenu(index);
          this.$emit('close', index, indexPath);
        }
      } else {
        this.openMenu(index, indexPath);
        this.$emit('open', index, indexPath);

        // TODO fix recursion and test
        // if (this.type === 'primary' && submenu.$slots.default) {
        //   const submenuSlots = submenu.$slots.default();
        //   const menuItem = this.getFirstMenuItem(submenuSlots);
        //   const nextActiveIndex = getValueByPath(menuItem, 'componentOptions.propsData.index');
        //   nextActiveIndex && this.setActiveIndex(nextActiveIndex, indexPath);
        // }

        if (this.scrollIntoExpanded) {
          this.$nextTick(() => {
            this.scrollToSubmenu(submenu.$el);
          });
        }
      }
    },

    scrollToSubmenu(submenuEl) {
      if (!this.isImmediateChildOfScrollbar) {
        return;
      }
      const scrollbarWrap = this.$parent.$refs.wrap;
      const viewRectTop = scrollbarWrap.scrollTop;
      const viewRectBottom = viewRectTop + scrollbarWrap.clientHeight;

      const top = submenuEl.getBoundingClientRect().top - this.$el.getBoundingClientRect().top;
      const bottom = top + submenuEl.offsetHeight;

      if (submenuEl.offsetHeight > scrollbarWrap.clientHeight || top < viewRectTop) {
        scrollbarWrap.scrollTop = top;
      } else if (bottom > viewRectBottom) {
        scrollbarWrap.scrollTop = bottom - scrollbarWrap.clientHeight;
      }
    },

    scrollToActiveItem() {
      const activeItem = this.items[this.activeIndex];
      if (activeItem && this.mode === 'vertical') {
        this.$nextTick(() => {
          this.scrollToSubmenu(activeItem.$el);
        });
      }
    },

    handleItemClick(item) {
      const { index, indexPath } = item;

      if (index !== this.activeIndex) {
        this.setActiveIndex(index, indexPath);
      }

      if (!item.isNested) {
        const previousIndex = this.openedMenus[0] || null;
        this.openedMenus = [];
        if (previousIndex) {
          this.$emit('close', previousIndex, [previousIndex]);
        }
      }

      if (this.mode === 'horizontal') {
        this.openedMenus = [];
        if (this.isOverflow && item.$el === this.getRightItem()) {
          this.scrollMenu(false);
        }
      }
    },
    updateOpenedMenu() {
      const index = this.activeIndex;
      const activeItem = this.items[index];
      if (!activeItem || this.mode === 'horizontal') return;

      const indexPath = activeItem.indexPath;

      indexPath.forEach((i) => {
        const submenu = this.submenus[i];
        submenu && this.openMenu(i, submenu.indexPath);
      });
    },
    routeToItem(item) {
      const route = item.route || item.index;
      try {
        this.$router.push(route);
      } catch (e) {
        console.error(e);
      }
    },
    open(index) {
      const { indexPath } = this.submenus[index.toString()];
      indexPath.forEach((i) => this.openMenu(i, indexPath));
    },
    close(index) {
      this.closeMenu(index);
    },
    updateControls() {
      const itemsList = Array.prototype.slice.call(this.$refs.menubar.children);
      if (itemsList.length <= 0) {
        this.itemsList = [];
        return 0;
      }

      const lastItem = itemsList[itemsList.length - 1];
      this.itemsList = itemsList;
      this.contentWidth = lastItem.offsetLeft + lastItem.offsetWidth + this.margin;
      this.isOverflow = this.contentWidth + 2 * this.margin > this.$refs.menu.offsetWidth;
    },
    scrollMenu(reverse) {
      const currentScrollLeft = this.$refs.menubar.scrollLeft;
      let overflowOffset = 0;
      if (!reverse) {
        const rightItem = this.getRightItem();
        const maxOverflowOffsetIncrement = this.getItemOffsetRight(this.itemsList[this.itemsList.length - 1]);
        if (rightItem) {
          overflowOffset = Math.min(this.getItemOffsetLeft(rightItem), maxOverflowOffsetIncrement);
        }
      } else {
        const leftItem = this.getLeftItem();
        if (leftItem) {
          overflowOffset = this.getItemOffsetLeft(leftItem);
        }
      }
      if (Math.abs(overflowOffset) > 1) {
        this.smoothScrollTo(currentScrollLeft + overflowOffset);
      }
    },
    updateControlGradient() {
      const barOffsetRight = this.getItemOffsetRight(this.itemsList[this.itemsList.length - 1]);
      this.hideControlGradient = barOffsetRight < 48; // 48px = width of gradient
    },
    smoothScrollTo(scrollLeft) {
      const el = this.$refs.menubar;
      const duration = 300;
      smoothScrollTo(el, 'horizontal', scrollLeft, duration);
    },
    getRightItem() {
      for (let i = 0; i < this.itemsList.length; i++) {
        const item = this.itemsList[i];
        const itemRect = item.getBoundingClientRect();
        const menuRect = this.$refs.menubar.getBoundingClientRect();
        if (itemRect.right > menuRect.right) return item;
      }
      return this.itemsList[this.itemsList.length - 1];
    },
    getLeftItem() {
      const barWidth = this.getBarWidth();
      for (let i = this.itemsList.length - 2; i >= 0; i--) {
        const item = this.itemsList[i];
        const itemRect = item.getBoundingClientRect();
        const menuRect = this.$refs.menubar.getBoundingClientRect();
        if (itemRect.left + barWidth < menuRect.left) return this.itemsList[i + 1];
      }
      return this.itemsList[0];
    },
    getBarWidth() {
      return this.$refs.menubar.offsetWidth + this.margin;
    },
    getItemOffsetLeft(item) {
      return item.getBoundingClientRect().left - this.$refs.menubar.getBoundingClientRect().left;
    },
    getItemOffsetRight(item) {
      return item.getBoundingClientRect().right - this.$refs.menubar.getBoundingClientRect().right;
    },
    getFirstMenuItem(children) {
      const firstComponent = getFirstComponentChild(children);
      return this.isMenuItem(firstComponent)
        ? firstComponent
        : this.getFirstMenuItem(getValueByPath(firstComponent, 'componentOptions.children'));
    },
    isMenuItem(component) {
      return getValueByPath(component, 'componentOptions.Ctor.extendOptions.name') === 'ElMenuItem'
            || component?.elm?.className.includes('el-menu-item');
    },
    updateActiveIndex(v) {
      const { activeIndex, router } = this;

      if (!router) return;

      const newActiveIndex = this.getActiveIndexFromRoute(v);

      if (newActiveIndex !== activeIndex) {
        this.activeIndex = newActiveIndex;
        this.updateOpenedMenu();
        this.scrollToActiveItem();
      }
    }
  }
};
</script>
