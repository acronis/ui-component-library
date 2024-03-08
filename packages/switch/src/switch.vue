<template>
  <div
    class="el-switch"
    :class="{
      'is-disabled': disabled,
      'is-checked': checked,
      'is-focus': focused,
      'is-reverse': reverse
    }"
    role="switch"
    :aria-checked="checked"
    :aria-disabled="disabled"
    @click="switchValue"
  >
    <span class="el-switch__content">
      <input
        ref="input"
        :id="label"
        class="el-switch__input"
        type="checkbox"
        :name="name"
        :disabled="disabled"
        :true-value="activeValue"
        :false-value="inactiveValue"
        @change="handleChange"
        @keydown.enter.prevent="switchValue"
        @focus="focused = true"
        @blur="focused = false"
      >
      <span
        :class="[
          'el-switch__control',
          size ? `el-switch__control--${size}` : '',
        ]"
      />
      <span
        v-if="$slots.default"
        :title="title()"
        class="el-switch__label el-text el-text--body-32 el-text--ellipsis"
      >
        <slot />
      </span>
    </span>
  </div>
</template>

<script>
import Focus from '@/mixins/focus';
import NodeText from '@/mixins/node-text';

export default {
  name: 'ElSwitch',

  mixins: [Focus('input'), NodeText],

  props: {
    name: {
      type: String,
      default: ''
    },

    modelValue: {
      type: [Boolean, String, Number],
      default: false
    },

    activeValue: {
      type: [Boolean, String, Number],
      default: true
    },

    inactiveValue: {
      type: [Boolean, String, Number],
      default: false
    },

    disabled: {
      type: Boolean,
      default: false
    },

    reverse: {
      type: Boolean,
      default: false
    },

    showHoverHint: {
      type: Boolean,
      default: false
    },

    size: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue', 'change'],

  data: () => ({ focused: false }),

  computed: {
    checked() {
      return this.modelValue === this.activeValue;
    }
  },

  watch: {
    checked() {
      this.$refs.input.checked = this.checked;
    }
  },

  created() {
    // eslint-disable-next-line no-bitwise
    if (!~[this.activeValue, this.inactiveValue].indexOf(this.modelValue)) {
      this.$emit('update:modelValue', this.inactiveValue);
    }
  },

  mounted() {
    /* istanbul ignore if */
    this.$refs.input.checked = this.checked;
  },

  methods: {
    handleChange() {
      this.$emit('update:modelValue', !this.checked ? this.activeValue : this.inactiveValue);
      this.$emit('change', !this.checked ? this.activeValue : this.inactiveValue);
      this.$nextTick(() => {
        // set input's checked property
        // in case parent refuses to change component's value
        if (this.$refs.input) {
          this.$refs.input.checked = this.checked;
        }
      });
    },

    switchValue() {
      this.$refs.input.click();
    },

    title() {
      let title = null;
      const defaultSlots = this.$slots.default();
      if (defaultSlots && this.showHoverHint) {
        title = this.getSlotTextContent(defaultSlots);
      }
      return title;
    }
  }
};
</script>
