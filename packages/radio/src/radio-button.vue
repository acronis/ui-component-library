<template>
  <label
    class="el-radio-button"
    :class="{
      [`el-radio-button--${computedSize}`]: computedSize,
      'is-disabled': isDisabled,
      'is-checked': isChecked,
      'is-focus': focus
    }"
    role="radio"
    :title="title()"
    :tabindex="tabIndex"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
    @keydown.enter.stop.prevent="handleKeyDown"
    @focus="handleFocus"
    @blur="handleBlur"
    @click="handleClick"
  >
    <span class="el-radio-button__content">
      <input
        ref="radioButton"
        v-model="model"
        class="el-radio-button__original"
        type="radio"
        tabindex="-1"
        :value="label"
        :name="name"
        :disabled="isDisabled"
        @change="handleChange"
      >
      <span class="el-text el-text--body-32 el-text--ellipsis">
        <slot>{{ label }}</slot>
      </span>
    </span>
  </label>
</template>

<script>
  import Emitter from '@/mixins/emitter';
  import Size from '@/mixins/size';
  import NodeText from '@/mixins/node-text';
  import Radio from './mixins/radio';

  export default {
    name: 'ElRadioButton',

    mixins: [
      Emitter,
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
        this.model = this.label;
      },
      title() {
        if (!this.showHoverHint) return null;
        const defaultSlots = this.$slots.default;
        if (defaultSlots) {
          return this.getSlotTextContent(defaultSlots);
        }
        return this.label;
      },
      handleClick() {
        /*
          Added click handler to correct safari focus issue.
          As a focus event is triggered in safari when an onClick event occurs,
          this handler prevents the element from incorrectly focused.
        */
        this.$refs.radioButton.focus();
      }
    }
  };
</script>
