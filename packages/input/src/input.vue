<template>
  <div
    :class="[
      isInput ? 'el-input' : 'el-textarea',
      isInput ? 'qa-input' : 'qa-textarea',
      {
        [`${isInput ? 'el-input' : 'el-textarea'}--${inputSize}`]: inputSize,
        [`${isInput ? 'el-input' : 'el-textarea'}--has-label`]: label,
        'is-disabled': disabled,
        'is-focus': focused,
        'is-active': isActive
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @mousedown="handleMouseDown"
    @click="handleClick"
  >
    <div
      v-if="label && inputSize === 'small'"
      class="el-text el-text--body-32 el-text--ellipsis"
    >
      {{ label }}
    </div>

    <div
      v-if="isInput"
      ref="container"
      :class="[
        'el-input__container',
        'qa-input-container',
        {
          'is-embedded': embedded,
          'has-suffix': hasSuffixComponents,
          'has-prefix': hasPrefixComponents
        }
      ]"
    >
      <div
        v-if="$slots.prefix || prefixIcon"
        class="el-input__prefix"
      >
        <slot name="prefix">
          <el-icon
            v-if="prefixIcon"
            :name="prefixIcon"
            :color="iconColor"
            class="el-input__icon qa-input-icon"
            :class="{'el-input__icon--control': onIconClick}"
            @click="handleIconClick"
          />
        </slot>
      </div>
      <div class="el-input__wrapper">
        <div
          v-if="label && inputSize !== 'small'"
          class="el-input__label qa-input-label"
          :class="{
            'is-active': isActive,
            'el-input__label--prefix': !!prefixIcon
          }"
        >
          {{ label }}
        </div>
        <div
          v-if="mask"
          v-show="showPlaceholder"
          :class="['qa-input-placeholder , el-input__placeholder', prefixIcon ? 'el-input__placeholder--prefix' : '']"
        >
          {{ placeholder }}
        </div>
        <template v-if="!!$slots.selectPrefix">
          <div class="el-input__select-prefix qa-input-select-prefix">
            <slot name="selectPrefix" />
          </div>
        </template>
        <input
          :id="id ? id : false"
          ref="input"
          :class="['qa-input-editor', 'el-input__editor', prefixIcon ? 'el-input__editor--prefix' : '']"

          step="any"
          :autofocus="autofocus"
          :placeholder="mask ? null : placeholder"
          :style="{ opacity: readonly ? 0 : 1 }"
          :aria-label="label"
          :type="inputType"
          :autocomplete="autoComplete"
          :disabled="disabled"
          :readonly="readonly"
          :value="displayValue"
          :min="min"
          :max="max"
          :name="name"
          :spellcheck="false"
          @focus="handleFocus"
          @input="handleInput"
          @blur="handleBlur"
          @click="handleClickMask"
          @change="handleChange"
          @keyup.enter="handleNumberEnter"
          @mousewheel="handleMousewheel"
        >
        <input
          v-if="readonly"
          ref="inputGhost"
          :class="[
            'el-input__editor',
            'el-input__editor--absolute-position',
            {
              'el-input__editor--prefix': prefixIcon,
              'el-input__editor--select-prefix': !!$slots.selectPrefix,
              'el-input__editor--select-suffix': !!$slots.selectSuffix
            }]"

          :type="inputType"
          :placeholder="mask ? null : placeholder"
          :aria-label="label"
          :autocomplete="autoComplete"
          :value="currentValue"
          :disabled="disabled"
          :readonly="readonly"
          :tabindex="-1"
          :spellcheck="false"
          @mousewheel="handleMousewheel"
        >
        <template v-if="!!$slots.selectSuffix">
          <div class="el-input__select-suffix qa-input-select-suffix">
            <slot name="selectSuffix" />
          </div>
        </template>
      </div>
      <div
        v-if="isSuffixVisible"
        class="el-input__suffix qa-input-suffix"
      >
        <el-icon
          v-if="showPasswordIcon"
          :name="passwordIconName"
          class="qa-input-icon el-input__icon el-input__icon--control"
          @click="handlePasswordIconClick"
        />
        <slot name="suffix">
          <el-icon
            v-if="suffixIcon"
            :name="suffixIcon"
            :color="iconColor"
            class="el-input__icon"
            :class="{'el-input__icon--control': onIconClick}"
            @click="handleIconClick"
          />
        </slot>
        <el-icon
          v-if="showClear"
          name="i-times--16"
          tabindex="0"
          class="el-input__icon el-input__icon--control el-input__icon--close"
          @keydown.enter.stop.prevent="clear"
          @click="clear"
        />
      </div>
      <div
        v-if="required && !disabled"
        class="qa-input-required el-input__required"
      >
        <el-icon name="i-star--16" />
      </div>
    </div>
    <div
      v-else
      class="el-textarea__container qa-textarea-container"
    >
      <div
        v-if="label && inputSize !== 'small'"
        class="el-textarea__label qa-textarea-label"
        :class="{'is-active': isActive}"
      >
        {{ label }}
      </div>
      <textarea
        :id="id ? id : false"
        ref="textarea"

        class="el-textarea__editor qa-textarea-editor"
        :autofocus="autofocus"
        :style="textareaStyle"
        :disabled="disabled"
        :value="currentValue"
        :aria-label="label"
        :placeholder="placeholder"
        :readonly="readonly"
        :rows="rows"
        :name="name"
        :spellcheck="false"
        @focus="handleFocus"
        @update:model-value="handleInput"
        @blur="handleBlur"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce';
import ElIcon from 'packages/icon';
import Focus from '@/mixins/focus';
import eventBus from '@/utils/eventBus';
import merge from '@/utils/merge';
import calcTextareaHeight from './calcTextareaHeight';

let IMask;

// util function copied from lodash
const MAX_SAFE_INTEGER = 9007199254740991;
const isLength = (value) => typeof value === 'number' && value > -1 && value % 1 === 0 && value <= MAX_SAFE_INTEGER;
const isArrayLike = (value) => value !== null && typeof value !== 'function' && isLength(value.length);

export default {
  name: 'ElInput',

  components: {
    ElIcon
  },

  mixins: [Focus('input')],

  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },

  props: {
    id: String,
    type: {
      type: String,
      default: 'text'
    },
    prefixValue: {
      type: String,
      default: ''
    },
    modelValue: [String, Number, Array, Function, Boolean, Object],
    placeholder: String,
    autoComplete: {
      type: String,
      default: 'off'
    },
    autofocus: Boolean,
    clearable: Boolean,
    disabled: Boolean,
    embedded: Boolean,
    readonly: Boolean,
    required: Boolean,
    name: String,
    max: {},
    min: {},
    step: {},
    mask: Object,
    label: String,
    prefixIcon: String,
    suffixIcon: String,
    onIconClick: {
      type: Function,
      default: () => {}
    },
    size: String,
    rows: {
      type: Number,
      default: 2
    },
    autosize: {
      type: [Boolean, Object],
      default: true
    },
    resize: String,
    validateEvent: {
      type: Boolean,
      default: true
    },
    showPasswordIcon: Boolean,
    defaultType: {
      type: String,
      default: 'password'
    },
    precision: {
      type: Number,
      validator(val) {
        return val >= 0 && val === parseInt(val, 10);
      }
    },
    debounceProcessMask: {
      type: Number,
      default: 0
    },
    debounceProcessNumber: {
      type: Number,
      default: 500
    },
    iconColor: {
      type: String,
      default: 'brand-primary'
    },
    freezeFocus: {
      type: Boolean,
      default: false
    }
  },

  emits: ['change', 'clear', 'click', 'blur', 'focus', 'update:model-value'],

  data() {
    return {
      currentValue: this.initCurrentValue(),
      userNumberInput: null,
      maskValue: this.prefixValue,
      hovering: false,
      focused: false,
      textareaCalcStyle: {},
      isPasswordHidden: this.defaultType === 'password'
    };
  },

  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize;
    },

    validateState() {
      return this.elFormItem ? this.elFormItem.validateState : '';
    },

    textareaStyle() {
      const style = merge({}, this.textareaCalcStyle, { resize: this.resize });
      return this.disabled && !this.autosize && this.$refs.textarea
        ? {
          ...style,
          maxHeight: `${this.$refs.textarea.offsetHeight}px`,
          minHeight: `${this.$refs.textarea.offsetHeight}px`
        } : style;
    },

    inputSize() {
      return this.size || this._elFormItemSize;
    },

    isInput() {
      return !this.isTextarea;
    },

    isTextarea() {
      return this.type === 'textarea';
    },

    isSuffixVisible() {
      return this.$slots.suffix || this.suffixIcon || this.clearable || this.showPasswordIcon;
    },

    isNumber() {
      return this.type === 'number';
    },

    isActive() {
      return !this.isClear || !!this.placeholder || this.focused;
    },

    isClear() {
      return this.currentValue === null
          || this.currentValue === undefined
          || (isArrayLike(this.currentValue) && this.currentValue.length === 0);
    },

    showClear() {
      return this.clearable && this.currentValue !== '';
    },

    showPlaceholder() {
      return this.prefixValue === this.currentValue || !this.currentValue;
    },

    passwordIconName() {
      return this.isPasswordHidden ? 'i-hide--16' : 'i-show--16';
    },

    inputType() {
      if (this.type === 'password' && this.showPasswordIcon) {
        return this.isPasswordHidden ? 'password' : 'text';
      }
      if (this.type === 'password' && !this.showPasswordIcon) {
        // TODO: remove side effects in computed
        /* eslint-disable-next-line vue/no-side-effects-in-computed-properties */
        this.isPasswordHidden = true;
      }
      return this.type;
    },

    displayValue() {
      if (this.userNumberInput !== null) {
        return this.userNumberInput;
      }
      return this.currentValue;
    },

    hasSuffixComponents() {
      if (!this.$slots.suffix) return false;
      return this.hasPseudoComponents(this.$slots.suffix());
    },

    hasPrefixComponents() {
      if (!this.$slots.prefix) return false;
      return this.hasPseudoComponents(this.$slots.prefix());
    }
  },

  watch: {
    modelValue(value) {
      let newVal = value;
      if (this.isNumber) {
        newVal = this.formatNumber(newVal);
        this.$emit('update:model-value', newVal);
      }
      this.setCurrentValue(newVal);

      if (this.validateEvent) {
        eventBus.$emit('el.form.change', [newVal]);
        eventBus.$emit('el.form.input', [newVal]);

        // this.dispatch('ElFormItem', 'el.form.change', [newVal]);
        // this.dispatch('ElFormItem', 'el.form.input', [newVal]);
      }

      this.$nextTick(() => {
        const inputEl = this.$refs.inputGhost;
        if (!inputEl) return;
        if (inputEl.clientWidth < inputEl.scrollWidth) {
          inputEl.setAttribute('title', value);
        } else {
          inputEl.removeAttribute('title');
        }
      });

      this.emitDisplayValue();
    },
    disabled() {
      this.emitDisplayValue();
    }
  },

  created() {
    eventBus.$on('inputSelect', this.inputSelect);
  },

  beforeMount() {
    import('imask').then((module) => {
      IMask = module.default;
    });
  },

  mounted() {
    this.resizeTextarea();
    this.autofocus && this.focus();
    this.debounceProcessChangeValue = debounce(this.debounceProcessNumber, (val) => {
      this.processChangeValue(val);
    });
    this.debounceProcessMaskChangeValue = debounce(this.debounceProcessMask, this.processMaskChangeValue);
    eventBus.$emit('el.multisearch.input.mount', this.$refs.input);

    // this.dispatch('ElMultiSearch', 'search.input.mount', this.$refs.input);
  },

  methods: {
    handlePasswordIconClick() {
      const { selectionStart, selectionEnd } = this.$refs.input;
      this.isPasswordHidden = !this.isPasswordHidden;
      setTimeout(() => {
        this.$refs.input.focus();
        this.$refs.input.setSelectionRange(selectionStart, selectionEnd);
      });
      this.onIconClick();
    },

    handleFocus(event) {
      this.focused = true;
      this.$emit('focus', event);
      eventBus.$emit('el.form.focus', [this.currentValue]);
      // this.dispatch('ElFormItem', 'el.form.focus', [this.currentValue]);
    },

    handleBlur(event) {
      if (!this.freezeFocus) this.focused = false;
      this.$emit('blur', event);
      eventBus.$emit('el.form.blur', [this.currentValue]);
      // this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);
      if (this.isNumber) {
        event.target.value = this.currentValue;
      }
    },

    handleClick(event) {
      if (this.disabled) return;
      this.$emit('click', event);
    },

    handleMousewheel(event) {
      /*
          I think that ellipsis should work only for readonly input.
          Maybe worth removing !this.focused from the condition.
        */
      const readOnly = !this.focused || this.readonly;
      const horizontalScroll = event.deltaX !== 0 || (event.shiftKey && event.deltaY !== 0);
      if (readOnly && horizontalScroll && this.$refs.input.scrollWidth > this.$refs.input.clientWidth) {
        event.preventDefault();
        event.stopPropagation();
      }
    },

    handleMouseDown(event) {
      if (this.disabled) return;
      const inputEl = this.$refs.input || this.$refs.textarea;
      if (event.target !== inputEl) {
        event.preventDefault();
      }
      this.focus();
    },

    handleClickMask(event) {
      if (event.target.selectionStart < this.prefixValue.length) {
        this.$nextTick(() => {
          event.target.setSelectionRange(this.prefixValue.length, this.prefixValue.length);
        });
      }
    },

    handleInput(event) {
      if (this.debounceProcessMask && this.mask && this.type === 'text') {
        this.$emit('update:modelValue', event.target.value);
        this.debounceProcessMaskChangeValue();
      } else {
        this.processInputValue(event);
      }
    },

    processInputValue(event) {
      let value = event.target.value;
      let maskedValue;

      if (this.mask && this.type === 'text') {
        maskedValue = new IMask(this.$refs.input, this.mask);
        value = maskedValue.value;
        maskedValue.destroy();
      }
      if (this.prefixValue.length > value.length) {
        this.setCurrentValue(this.prefixValue);
        this.$emit('update:model-value', this.prefixValue);
        event.target.value = this.prefixValue;
      } else {
        if (this.isNumber) {
          this.userNumberInput = value;
          this.debounceProcessChangeValue(this.userNumberInput);
        } else if (this.prefixValue && !this.mask && !value.startsWith(this.prefixValue)) {
          value = this.prefixValue + value;
          this.setCurrentValue(value);
        } else {
          this.setCurrentValue(value);
        }
        this.$emit('update:model-value', value);
      }
    },

    handleChange(event) {
      this.processChangeValue(event.target.value);
    },

    handleNumberEnter() {
      if (this.isNumber) {
        this.processChangeValue(this.currentValue);
      }
    },

    processMaskChangeValue() {
      const maskedValue = new IMask(this.$refs.input, this.mask);
      const value = maskedValue.value;

      maskedValue.destroy();
      this.setCurrentValue(value);
      this.$emit('update:model-value', value);
    },

    processChangeValue(oldValue) {
      let value = oldValue;
      if (this.isNumber) {
        value = this.formatNumber(this.userNumberInput || oldValue);
        this.userNumberInput = null;
      }
      if (value !== this.currentValue) {
        this.setCurrentValue(value);
      }
      this.$emit('change', value);
    },

    handleIconClick(event) {
      if (this.disabled) {
        return;
      }
      this.onIconClick(event);
    },

    initCurrentValue() {
      if (this.isNumber || this.type === 'number') {
        return this.formatNumber(this.modelValue);
      }

      if (this.prefixValue) {
        return `${typeof this.modelValue === 'string' && this.modelValue.indexOf(this.prefixValue) !== 0
          ? this.prefixValue : ''}${this.modelValue || ''}`;
      }

      return this.modelValue;
    },

    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.$nextTick(() => {
        this.resizeTextarea();
      });
      this.currentValue = value;
    },

    resizeTextarea() {
      const { autosize, type } = this;
      if (type !== 'textarea') return;
      if (!autosize) {
        this.textareaCalcStyle = {
          minHeight: calcTextareaHeight(this.$refs.textarea).minHeight
        };
        return;
      }
      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;

      this.textareaCalcStyle = calcTextareaHeight(this.$refs.textarea, minRows, maxRows);
    },

    inputSelect() {
      (this.$refs.input || this.$refs.textarea).select();
    },

    focus() {
      (this.$refs.input || this.$refs.textarea).focus();
    },

    clear() {
      this.$emit('change', '');
      this.$emit('update:model-value', '');
      this.$emit('clear');
      this.setCurrentValue('');
      this.focus();
    },

    formatNumber(value) {
      if (value === '') return '';
      let newVal = Number(value);

      if (isNaN(newVal)) return '';
      if (this.precision !== undefined) {
        newVal = this.toPrecision(newVal, this.precision);
      }
      if (this.max && newVal >= this.max) return this.max;
      if (this.min && newVal <= this.min) return this.min;
      return newVal;
    },

    toPrecision(num, precision) {
      return parseFloat(Math.round(num * 10 ** precision) / 10 ** precision);
    },

    emitDisplayValue() {
      if (this.$parent && this.elFormItem.$options && this.$parent.$options.name === this.elFormItem.$options.name) {
        this.$nextTick(() => {
          const displayValue = {};
          displayValue[this.elFormItem.prop] = this.modelValue && !this.disabled ? this.modelValue : '';
          eventBus.$emit('el.multisearch.displayValue', displayValue);
          // this.dispatch('ElMultiSearch', 'display-value', displayValue);
        });
      }
    },

    injectText(text) {
      const element = this.$refs.input || this.$refs.textarea;
      // Find cursor position and insert text at cursor position
      const position = element.selectionStart || this.currentValue.length;
      const updatedValue = `${this.currentValue.slice(0, position)}${text}${this.currentValue.slice(position)}`;
      this.setCurrentValue(updatedValue);
      const newPosition = updatedValue.indexOf(text) + text.length;
      // Set cursor position to after inserted text
      this.$nextTick(() => {
        element.focus();
        element.setSelectionRange(newPosition, newPosition);
      });
    },

    hasPseudoComponents(components) {
      const excludeComponents = ['el-icon', 'el-spinner', 'el-divider'];
      const filteredComponents = components.filter((component) => (
        component?.componentOptions?.tag && !excludeComponents.includes(component?.componentOptions?.tag)
      ));
      return filteredComponents.length > 0;
    }
  }
};
</script>
