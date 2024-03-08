<template>
  <label
    class="el-checkbox-button"
    :class="{
      [`el-checkbox-button--${size}`]: size,
      'is-disabled': isDisabled,
      'is-checked': isChecked,
      'is-focus': focus
    }"
    role="checkbox"
    :title="title()"
    :tabindex="tabIndex"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    @focus="handleFocus"
    @blur="handleBlur"
    @mousedown="handleMousedown"
    @mouseup="isMouseDown = false"
    @keydown.enter.stop.prevent="handleEnterKeyDown"
  >
    <span class="el-checkbox-button__content">
      <input
        v-if="trueLabel || falseLabel"
        ref="input"
        v-model="model"
        class="el-checkbox-button__original"
        type="checkbox"
        tabindex="-1"
        :name="name"
        :disabled="isDisabled"
        :true-value="trueLabel"
        :false-value="falseLabel"
        @change="handleChange"
      >
      <input
        v-else
        ref="input"
        v-model="model"
        class="el-checkbox-button__original"
        type="checkbox"
        tabindex="-1"
        :name="name"
        :disabled="isDisabled"
        :value="label"
        @change="handleChange"
      >
      <span class="el-text el-text--body-32 el-text--ellipsis">
        <slot>{{ label }}</slot>
      </span>
    </span>
  </label>
</template>

<script>
import { nextTick } from 'vue';
import NodeText from '@/mixins/node-text';
import Size from '@/mixins/size';

import Checkbox from './mixins/checkbox';

export default {
  name: 'ElCheckboxButton',

  mixins: [
    Size,
    Checkbox,
    NodeText
  ],

  inject: {
    elFormItem: {
      default: ''
    }
  },

  data: () => ({
    focus: false,
    isMouseDown: false
  }),

  methods: {
    handleEnterKeyDown() {
      this.$refs.input.click();
    },

    handleFocus() {
      this.focus = !this.isDisabled;

      if (this.isMouseDown) {
        this.$refs.input.focus();
      }
    },

    handleBlur() {
      this.focus = false;
    },

    handleMousedown() {
      /*
          Added mousedown handler to correct safari focus issue.
          As a focus event is triggered in safari when an onClick event occurs,
          this handler checks and prevents the element from incorrectly focused.
        */
      this.isMouseDown = true;
      nextTick(() => {
        if (document.activeElement === this.$el) {
          this.$refs.input.focus();
        }
      });
    },

    title() {
      if (!this.showHoverHint) return null;
      const defaultSlots = this.$slots.default;
      if (defaultSlots) {
        return this.getSlotTextContent(defaultSlots());
      }
      return this.label;
    }
  }
};
</script>
