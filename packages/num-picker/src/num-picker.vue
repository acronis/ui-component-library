<template>
  <div
    class="el-num-picker"
    :class="{
      'is-disabled': disabled || infinity,
      'is-focus': focused
    }"
  >
    <div
      v-if="label"
      class="el-text el-text--body-32 el-text--ellipsis"
    >
      {{ label }}
    </div>
    <div
      class="el-num-picker__container"
      :class="{'is-disabled': disabled}"
    >
      <span
        role="button"
        class="el-num-picker__decrease"
        :class="{'is-disabled': minDisabled}"
        @click="decrease"
        @keydown.enter="decrease"
        @mousedown="focused = !minDisabled"
        @mouseup="focused = false"
      >
        <el-icon name="i-minus--16" />
      </span>

      <el-input
        v-if="!infinity"
        ref="input"
        class="el-num-picker__editor"
        size="small"
        :disabled="disabled || infinity"
        :name="name"
        :min="min"
        :max="max"
        :model-value="`${prefix}${currentValue}${suffix}`"
        @keydown.up.prevent="increase"
        @keydown.down.prevent="decrease"
        @blur="handleBlur"
        @focus="handleFocus"
        @update:model-value="debounceHandleInput"
      />
      <div
        v-if="infinity"
        class="el-num-picker__infinity"
      >
        <el-icon
          name="i-infinity--32"
          size="16"
        />
      </div>
      <span
        class="el-num-picker__increase"
        :class="{'is-disabled': maxDisabled}"
        role="button"
        @click="increase"
        @keydown.enter="increase"
        @mousedown="focused = !maxDisabled"
        @mouseup="focused = false"
      >
        <el-icon name="i-plus--16" />
      </span>
    </div>
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce';

import ElIcon from 'packages/icon';
import ElInput from 'packages/input';
import Focus from '@/mixins/focus';
import eventBus from '@/utils/eventBus';

export default {
  name: 'ElNumPicker',

  components: {
    ElIcon,
    ElInput
  },

  mixins: [Focus('input')],

  inject: {
    elFormItem: {
      default: ''
    }
  },

  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: Infinity
    },
    min: {
      type: Number,
      default: -Infinity
    },
    step: {
      type: Number,
      default: 1
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    disabled: Boolean,
    debounce: {
      type: Number,
      default: 500
    },
    name: String,
    label: String,
    integerOnly: Boolean,
    stepStrictly: Boolean,
    infinity: Boolean
  },

  emits: ['update:modelValue', 'change', 'blur', 'focus'],

  data: () => ({
    currentValue: 0,
    focused: false
  }),

  computed: {
    minDisabled() {
      return this.disabled || this.infinity || this._decrease(this.modelValue, this.step) < this.min;
    },

    maxDisabled() {
      return this.disabled || this.infinity || this._increase(this.modelValue, this.step) > this.max;
    },

    precision() {
      const { modelValue, step, getPrecision } = this;

      return Math.max(getPrecision(modelValue), getPrecision(step));
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(value) {
        let newVal = Number(value);
        if (this.stepStrictly) {
          newVal = this.handleStepPrecision(newVal);
        }
        if (isNaN(newVal)) return;
        if (newVal >= this.max) newVal = this.max;
        if (newVal <= this.min) newVal = this.min;
        this.currentValue = newVal;
        this.$emit('update:modelValue', newVal);
        this.emitDisplayValue();
      }
    },
    disabled() {
      this.emitDisplayValue();
    }
  },

  created() {
    this.debounceHandleInput = debounce(this.debounce, (value) => {
      this.handleInput(this.integerOnly ? Math.trunc(parseFloat(value)).toString() : value);
    });
  },

  mounted() {
    if (this.$refs.input) {
      const innerInput = this.$refs.input.$refs.input;
      innerInput.setAttribute('role', 'spinbutton');
      innerInput.setAttribute('aria-valuemax', this.max);
      innerInput.setAttribute('aria-valuemin', this.min);
      innerInput.setAttribute('aria-valuenow', this.currentValue);
      innerInput.setAttribute('aria-disabled', this.disabled);
    }
  },

  updated() {
    if (this.$refs.input) {
      const innerInput = this.$refs.input.$refs.input;
      innerInput.setAttribute('aria-valuenow', this.currentValue);
    }
  },

  methods: {
    toPrecision(num, precision = this.precision) {
      return parseFloat(parseFloat(Number(num).toFixed(precision)));
    },

    getPrecision(value) {
      const valueString = value.toString();
      const dotPosition = valueString.indexOf('.');
      let precision = 0;
      if (dotPosition !== -1) {
        precision = valueString.length - dotPosition - 1;
      }
      return precision;
    },

    _increase(val, step) {
      if (typeof val !== 'number') return this.currentValue;

      const precisionFactor = 10 ** this.precision;

      return this.toPrecision((precisionFactor * val + precisionFactor * step) / precisionFactor);
    },

    _decrease(val, step) {
      if (typeof val !== 'number') return this.currentValue;

      const precisionFactor = 10 ** this.precision;

      return this.toPrecision((precisionFactor * val - precisionFactor * step) / precisionFactor);
    },

    increase() {
      const newVal = this._increase(this.modelValue, this.step);
      if (newVal > this.max || this.disabled || this.maxDisabled) return;
      this.setCurrentValue(newVal);
    },

    decrease() {
      const newVal = this._decrease(this.modelValue, this.step);
      if (newVal < this.min || this.disabled || this.minDisabled) return;
      this.setCurrentValue(newVal);
    },

    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
    },

    handleBlur(event) {
      this.focused = false;
      this.$emit('blur', event);
      this.setCurrentValue(this.currentValue);
    },

    setCurrentValue(newVal) {
      const oldVal = this.currentValue;
      if (newVal >= this.max) newVal = this.max; // eslint-disable-line no-param-reassign
      if (newVal <= this.min) newVal = this.min; // eslint-disable-line no-param-reassign
      if (oldVal === newVal) {
        this.$refs.input.setCurrentValue(this.prefix + this.currentValue.toString() + this.suffix);
        return;
      }
      this.$emit('change', newVal, oldVal);
      this.$emit('update:modelValue', newVal);
      this.currentValue = newVal;
      this.$refs.input.setCurrentValue(this.prefix + this.currentValue.toString() + this.suffix);
    },

    handleInput(value) {
      let localValue = value.trim();
      const suffix = this.suffix?.trim();
      if (this.prefix && this.prefix !== '-') {
        if (localValue.indexOf(this.prefix) === 0) {
          localValue = localValue.slice(this.prefix.length);
        }
      }

      if (suffix) {
        if (localValue.lastIndexOf(suffix) === (localValue.length - suffix.length)) {
          localValue = localValue.slice(0, -suffix.length);
        }
      }

      if (localValue === '') {
        return;
      }

      if (localValue.lastIndexOf('.') === (localValue.length - 1)) {
        this.setCurrentValue(this.currentValue);
        return;
      }

      if (localValue.split('.').length > 2) {
        this.setCurrentValue(this.currentValue);
        return;
      }

      if (Number(localValue.replace(/^(-)|[^\d.]+/gm, '$1')) === this.currentValue) {
        this.setCurrentValue(this.currentValue);
        return;
      }

      if (this.prefix || suffix) {
        const modValue = Number(localValue.replace(/^(-)|[^\d.]+/gm, '$1'));
        if (!isNaN(modValue)) {
          this.setCurrentValue(modValue);
        }
        if (this.stepStrictly) {
          this.currentValue = this.handleStepPrecision(this.currentValue);
        }
        this.setCurrentValue(this.currentValue);
        return;
      }

      const newVal = Number(localValue);
      if (!isNaN(newVal)) {
        this.setCurrentValue(newVal);
      } else {
        this.setCurrentValue(this.currentValue);
      }
    },

    handleStepPrecision(value) {
      const stepPrecision = this.getPrecision(this.step);
      const precisionFactor = 10 ** stepPrecision;

      return (Math.round(value / this.step) * precisionFactor * this.step) / precisionFactor;
    },

    emitDisplayValue() {
      if (this.$parent && this.elFormItem.$options && this.$parent.$options.name === this.elFormItem.$options.name) {
        this.$nextTick(() => {
          const displayValue = {};
          displayValue[this.elFormItem.prop] = this.modelValue && !this.disabled
            ? (this.prefix + this.modelValue + this.suffix) : '';
          eventBus.$emit('el.multisearch.displayValue', displayValue);
        });
      }
    }
  }
};
</script>
