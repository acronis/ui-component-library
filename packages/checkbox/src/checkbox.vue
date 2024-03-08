<template>
  <label
    :id="id"
    class="el-checkbox qa-checkbox"
    :class="{
      'is-indeterminate': indeterminate,
      'is-disabled': isDisabled,
      'is-checked': isChecked,
      'is-active': active && !indeterminate && !isDisabled && !isChecked,
      'is-multiline': multilineLabel,
      [`multiline-limit--${multilineLabelLimit}`]: multilineLabel && multilineLabelLimit
    }"
    role="checkbox"
    tabindex="0"
    :title="title()"
    :aria-checked="indeterminate ? 'mixed': isChecked"
    :aria-disabled="isDisabled"
    @keydown.enter="handleKeyDown"
    @keyup.enter="handleKeyUp"
    @blur="handleBlur"
    @dblclick="handleBlur"
    @mousedown="handleBlur"
    @click="handleBlur"
  >
    <span class="el-checkbox__content qa-checkbox-content">
      <span class="el-checkbox__control qa-checkbox-control">
        <el-icon
          v-show="isChecked"
          name="i-check-square--16"
        />
        <input
          v-if="trueLabel || falseLabel"
          ref="input"
          v-model="model"
          class="el-checkbox__original qa-checkbox-original"
          type="checkbox"
          tabindex="-1"
          :name="name"
          :disabled="isDisabled"
          :true-value="trueLabel"
          :false-value="falseLabel"
          @change="handleChange"
          @click.stop
        >
        <input
          v-else
          ref="input"
          v-model="model"
          class="el-checkbox__original qa-checkbox-original"
          type="checkbox"
          tabindex="-1"
          :value="label"
          :name="name"
          :disabled="isDisabled"
          @change="handleChange"
          @click.stop
        >
      </span>
      <span
        v-if="label || $slots.default"
        class="el-checkbox__label qa-checkbox-label el-text el-text--body-32 el-text--ellipsis"
      >
        <slot>{{ label }}</slot>
      </span>
    </span>
    <span
      v-if="$slots.description"
      class="el-checkbox__description qa-checkbox-description el-text el-text--body-24"
    >
      <slot name="description" />
    </span>
  </label>
</template>

<script>
import ElIcon from 'packages/icon';
import NodeText from '@/mixins/node-text';
import Size from '@/mixins/size';
import eventBus from '@/utils/eventBus';

import Checkbox from './mixins/checkbox';

export default {
  name: 'ElCheckbox',

  components: {
    ElIcon
  },

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

  props: {
    modelValue: {},
    id: String,
    controls: String,
    indeterminate: Boolean,
    multilineLabel: Boolean,
    multilineLabelLimit: {
      type: Number,
      validator: (value) => [2, 3].indexOf(value) > -1
    }
  },

  data: () => ({
    active: false
  }),

  watch: {
    value() {
      this.emitDisplayValue();
    }
  },

  mounted() {
    if (this.indeterminate) {
      this.$el.setAttribute('aria-controls', this.controls);
    }
  },

  methods: {
    handleKeyDown() {
      this.active = true;
    },

    handleKeyUp() {
      this.$refs.input.click();
      this.active = false;
    },

    handleBlur() {
      this.$el.blur();
      this.active = false;
    },

    title() {
      if (!this.showHoverHint) return null;
      const defaultSlots = this.$slots.default;
      if (defaultSlots) {
        return this.getSlotTextContent(defaultSlots());
      }
      return null;
    },

    emitDisplayValue() {
      if (this.$parent && this.elFormItem.$options && this.$parent.$options.name === this.elFormItem.$options.name) {
        this.$nextTick(() => {
          const displayValue = {};
          displayValue[this.elFormItem.prop] = this.value ? this.name : '';

          eventBus.$emit('el.multisearch.displayValue', displayValue);
        });
      }
    }
  }
};
</script>
