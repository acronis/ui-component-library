<template>
  <label
    class="el-radio qa-radio"
    :class="{
      [`el-radio--${computedSize}`]: computedSize,
      'is-disabled': isDisabled,
      'is-checked': isChecked,
      'is-focus': focus,
      'is-active': active
    }"
    role="radio"
    :title="title()"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    :tabindex="tabIndex"
    @keydown.enter="handleKeyDown"
    @keyup.enter.stop.prevent="handleKeyUp"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <span class="el-radio__content qa-radio-content">
      <span class="el-radio__control qa-radio-control">
        <input
          v-model="model"
          class="el-radio__original qa-radio-original"
          type="radio"
          :value="label"
          :name="name"
          :disabled="isDisabled"
          tabindex="-1"
          @change="handleChange"
        >
      </span>
      <span
        v-if="$slots.default"
        class="el-radio__label qa-radio-label el-text el-text--body-32 el-text--ellipsis"
      >
        <slot />
      </span>
    </span>
    <span
      v-if="$slots.description"
      class="el-radio__description qa-radio-description el-text el-text--body-24"
    >
      <slot name="description" />
    </span>
  </label>
</template>

<script>
import NodeText from '@/mixins/node-text';
import Size from '@/mixins/size';

import Radio from './mixins/radio';

export default {
  name: 'ElRadio',

  mixins: [
    Size,
    Radio,
    NodeText
  ],

  inject: {
    elFormItem: {
      default: ''
    }
  },

  methods: {
    handleKeyDown() {
      this.active = true;
    },

    handleKeyUp() {
      this.model = this.label;
      this.active = false;
    },

    title() {
      if (!this.showHoverHint) return null;
      const defaultSlots = this.$slots.default;
      if (defaultSlots) {
        return this.getSlotTextContent(defaultSlots());
      }
      return null;
    }
  }
};
</script>
