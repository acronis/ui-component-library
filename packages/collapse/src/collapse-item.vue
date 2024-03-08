<template>
  <div
    class="el-collapse-item"
    :class="{
      [`el-collapse-item--size-${$parent.size}`]: $parent.size,
      'is-collapsed': isActive,
      'el-collapse-item--no-background': noBackground,
      'el-collapse-item--no-border': noBorder,
      'el-collapse-item--no-padding': noPadding,
      'el-collapse-item--without-arrow': withoutArrow
    }"
    :aria-expanded="isActive"
    :aria-controls="`el-collapse-content-${name}`"
    :aria-describedby="`el-collapse-content-${name}`"
    role="tab"
  >
    <div
      :id="`el-collapse-head-${name}`"
      class="el-collapse-item__header"
      :class="{
        'el-collapse-item__header--reversed': leftArrow,
        'el-collapse-item__header--clickable': clickTitleToCollapse && !disabled,
        [`el-collapse-item--color-title-background-${titleBackground}`]: titleBackground
      }"
      role="button"
      @click="handleTitleClick"
    >
      <div class="el-collapse-item__title">
        <slot name="title">
          <span class="el-text el-text--body-32 el-text--ellipsis">{{ title }}</span>
        </slot>
      </div>
      <el-button
        v-if="!withoutArrow"
        class="el-collapse-item__button"
        :class="{'is-collapsed': isActive}"
        :disabled="disabled"
        type="ghost"
        @click.stop.prevent="handleHeaderClick"
        @keydown.enter.stop.prevent="handleEnter"
      >
        <el-icon
          v-if="icon"
          :name="icon"
        />
        <el-icon
          v-else
          class="el-collapse-item__arrow"
          name="i-chevron-right--16"
        />
      </el-button>
    </div>
    <div
      v-show="isActive"
      :id="`el-collapse-content-${name}`"
      class="el-collapse-item__content"
      :class="{
        [`el-collapse-item--color-panel-background-${panelBackground}`]: panelBackground
      }"
      :aria-labelledby="`el-collapse-head-${name}`"
      :aria-hidden="!isActive"
      role="tabpanel"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';

import ElButton from 'packages/button';
import ElIcon from 'packages/icon';
import eventBus from '@/utils/eventBus';

export default {
  name: 'ElCollapseItem',

  components: {
    ElIcon,
    ElButton
  },

  inject: ['collapse'],

  props: {
    icon: String,
    leftArrow: {
      type: Boolean,
      default: false
    },
    name: {
      type: [String, Number],
      default() {
        return uuidv4();
      }
    },
    noBackground: {
      type: Boolean,
      default: false
    },
    titleBackground: {
      type: String,
      default: 'fixed-white'
    },
    panelBackground: {
      type: String,
      default: 'brand-lightest'
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    noPadding: {
      type: Boolean,
      default: false
    },
    clickTitleToCollapse: {
      type: Boolean,
      default: false
    },
    title: String,
    withoutArrow: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      contentWrapStyle: {
        height: 'auto',
        display: 'block'
      },
      contentHeight: 0,
      checked: false
    };
  },

  computed: {
    isActive() {
      return this.collapse.activeNames.indexOf(this.name) > -1;
    }
  },

  methods: {
    handleTitleClick() {
      /* istanbul ignore else */
      if (this.clickTitleToCollapse) {
        this.handleHeaderClick();
      }
    },
    handleHeaderClick() {
      if (!this.disabled) {
        eventBus.$emit('el.collapse.item.click', this);
        // this.dispatch('ElCollapse', 'item-click', this);
      }
    },
    handleEnter() {
      if (!this.disabled) {
        eventBus.$emit('el.collapse.item.click', this);
        // this.dispatch('ElCollapse', 'item-click', this);
      }
    }
  }
};
</script>
