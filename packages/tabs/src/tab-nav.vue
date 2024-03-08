<template>
  <div
    ref="nav"
    :class="{
      'el-tabs__nav': true,
      'el-tabs__nav--large': large,
      'el-tabs__nav--spaced': !noMargin
    }"
    role="tablist"
    @keydown="changeTab"
  >
    <div
      v-for="pane in panes"
      :id="`tab-${pane.key}`"
      :key="pane.key"
      ref="tabs"
      :class="[
        'tab-title',
        'el-tabs__item',
        {
          'el-tabs__item': true,
          'is-active': pane.key === currentTabKey,
          'is-disabled': pane.disabled,
          'is-focus': isFocus && !pane.disabled,
        },
      ]"
      :aria-controls="`pane-${pane.name}`"
      tabindex="1"
      role="tab"
      :aria-selected="pane.active"
      @focus="setFocus"
      @blur="removeFocus"
      @mousedown="isMousedown = true"
      @mouseup="isMousedown = false"
      @click="$emit('tab-click', pane, pane.key, $event)"
    >
      <template v-if="pane.icon">
        <el-icon :name="pane.icon" />
      </template>
      <span
        v-else
        class="el-tabs__item-label"
      >{{ pane.title }}</span>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue';

import ElIcon from 'packages/icon';

const KEY_CODE = Object.freeze({
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40
});

export default {
  name: 'ElTabNav',

  components: { ElIcon },

  props: {
    panes: Array,
    large: {
      type: Boolean,
      default: false
    },
    onTabClick: {
      type: Function
    },
    noMargin: {
      type: Boolean,
      default: false
    }
  },
  emits: ['tab-click'],

  setup(props) {
    const currentTabKey = inject('currentTabKey');

    return { ...props, currentTabKey };
  },

  data() {
    return {
      isFocus: false,
      isMousedown: false
    };
  },

  methods: {
    changeTab(e) {
      const keyCode = e.keyCode;
      let nextIndex;
      let currentIndex;
      let tabList;
      if ([KEY_CODE.LEFT, KEY_CODE.UP, KEY_CODE.RIGHT, KEY_CODE.DOWN].indexOf(keyCode) !== -1) {
        tabList = e.currentTarget.querySelectorAll('[role=tab]');
        currentIndex = this.panes.map((x) => x.name).indexOf(this.currentTabKey);
      } else {
        return;
      }
      if (keyCode === KEY_CODE.LEFT || keyCode === KEY_CODE.UP) { // left
        if (currentIndex === 0) { // first
          nextIndex = tabList.length - 1;
        } else {
          nextIndex = currentIndex - 1;
        }
      } else { // right
        // eslint-disable-next-line no-lonely-if
        if (currentIndex < tabList.length - 1) { // not last
          nextIndex = currentIndex + 1;
        } else {
          nextIndex = 0;
        }
      }
      tabList[nextIndex].focus();
      tabList[nextIndex].click();
      this.removeFocus();
    },
    reFocus() {
      const currentTab = this.$refs.tabs?.filter((x) => x.id === `tab-${this.currentTabKey}`)[0];
      if (currentTab && currentTab !== document.activeElement) {
        currentTab.focus();
        this.$nextTick(this.removeFocus);
      }
    },
    setFocus() {
      if (!this.isMousedown) {
        this.isFocus = true;
      }
    },
    removeFocus() {
      this.isFocus = false;
    },
    getTabLabel(pane) {
      return pane.labelContent() || pane.title;
    }
  }
};
</script>
