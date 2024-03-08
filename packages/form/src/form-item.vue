<template>
  <div
    class="el-form-item"
    :class="[{
      'is-required': isRequired || required,
      'is-error-absolute': !isErrorInHolder,
      'is-validating': isValidating,
      'is-success': valid,
      'is-error': invalid,
      'is-touched': touched,
      'is-focus': isFocused,
      'is-wrapping-file-picker': isWrappingFilePicker
    }]"
  >
    <label
      v-if="label || $slots.label"
      :for="labelFor"
      class="el-form-item__label"
    >
      <slot name="label">{{ label }}</slot>
    </label>
    <div class="el-form-item__content">
      <slot />
      <div
        v-show="displayErrorAlways || isInvalidMessageShown"
        class="el-form-item__error-holder"
      >
        <div
          v-if="isInvalidMessageShown"
          class="el-form-item__error"
        >
          <el-form-error
            v-for="(message, index) in errorMessages"
            :key="`message-${index}`"
          >
            {{ message }}
          </el-form-error>
        </div>
        <div
          v-else-if="hintText"
          class="el-form-item__hint el-text--caption el-text--ellipsis el-text--color-fixed-light"
        >
          {{ hintText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AsyncValidator from 'async-validator';
import { debounce } from 'throttle-debounce';

import eventBus from '@/utils/eventBus';
import objectAssign from '@/utils/merge';
import { noop, getPropByPath } from '@/utils/util';

import { DEBOUNCE_DELAY } from './form-constants';
import ElFormError from './form-error.vue';

/**
   * Get form-item rules from form root rules.
   * It supports, in sequence:
   *     1. prop key, i.e. same as getPropByPath.
   *     2. async validator fields (array/object).
   *     3. async validator defaultField (array/object).
   */
const getRulesByPath = (rules, prop = '') => {
  const paths = prop.split('.');
  let current = rules;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current) break;

    if (current[path] !== undefined) {
      current = current[path];
    } else if (current.fields !== null && typeof current.fields === 'object' && current.fields[path] !== undefined) {
      current = current.fields[path];
    } else {
      current = current.defaultField;
    }
  }
  return current || null;
};

export default {
  name: 'ElFormItem',

  components: {
    ElFormError
  },

  provide() {
    return {
      elFormItem: this,
      elFormItemIsInvalid: () => this.invalid
    };
  },

  inject: ['elForm'],

  props: {
    label: String,
    prop: String,
    required: {
      type: Boolean,
      default: undefined
    },
    rules: [Object, Array],
    error: [String, Array, Boolean],
    inlineMessage: {
      type: [Boolean, String],
      default: ''
    },
    validateStatus: String,
    for: String,
    showMessage: {
      type: Boolean,
      default: true
    },
    dynamic: {
      type: Boolean,
      default: false
    },
    displayErrorAlways: {
      type: Boolean,
      default: true
    },
    hint: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    initialValue: '',
    validateState: '',
    errorMessage: '',
    errorMessages: [],
    validateDisabledByChange: false,
    validateDisabledByInput: false,
    validator: {},
    touched: false,
    isFocused: false,
    isWrappingFilePicker: false
  }),

  computed: {
    dirty() {
      if (Array.isArray(this.initialValue)) {
        return JSON.stringify(this.initialValue) !== JSON.stringify(this.fieldValue);
      }
      return this.initialValue !== this.fieldValue;
    },

    isValidating() {
      return this.validateState === 'validating';
    },

    valid() {
      return this.validateState === 'success';
    },

    invalid() {
      return this.validateState === 'error';
    },

    isEmpty() {
      // if a single field in the form is required but unfilled, form validity will be invalid.
      return this.isRequired ? (this.fieldValue === '' || Array.isArray(this.fieldValue) ? this.fieldValue.length === 0 : false) : false;
    },

    labelFor() {
      return this.for || this.prop;
    },

    form() {
      return this.elForm;
    },

    fieldValue: {
      cache: false,
      get() {
        const model = this.form.model;
        if (!model || !this.prop) { return; }

        let path = this.prop;
        if (path.indexOf(':') !== -1) {
          path = path.replace(/:/, '.');
        }

        return getPropByPath(model, path, !this.dynamic).v;
      }
    },

    isRequired() {
      return this.allRules.filter((it) => it.required).length > 0;
    },

    isInvalidMessageShown() {
      return this.validateState === 'error' && this.showMessage && this.form.showMessage;
    },

    isErrorInHolder() {
      return typeof this.inlineMessage === 'boolean'
        ? this.inlineMessage
        : (this.form?.inlineMessage || false);
    },

    allRules() {
      let formRules = this.form.rules;
      const selfRules = this.rules;
      const requiredRule = this.required !== undefined ? { required: !!this.required } : [];

      formRules = formRules ? getRulesByPath(formRules, this.prop || '') : [];

      return [].concat(selfRules || formRules || []).concat(requiredRule);
    },
    hintText() {
      return this.hint || this.form.hints?.[this.prop || this.labelFor] || '';
    }
  },

  watch: {
    error: {
      immediate: true,
      handler(value) {
        if (typeof value === 'boolean') {
          this.errorMessage = '';
          this.errorMessages = [];
          this.validateState = value ? 'error' : '';
        } else if (Array.isArray(value)) {
          this.errorMessages = value;
          this.errorMessage = value.length ? value[0] : '';
          this.validateState = value.length ? 'error' : '';
        } else {
          this.errorMessages = value ? [value] : [];
          this.errorMessage = value;
          this.validateState = value ? 'error' : '';
        }
      }
    },

    validateStatus(value) {
      this.validateState = value;
    },

    touched: {
      immediate: true,
      handler(newVal) {
        this.$emit('status', { name: 'touched', value: newVal });
      }
    },
    untouched: {
      immediate: true,
      handler(newVal) {
        this.$emit('status', { name: 'untouched', value: newVal });
      }
    },
    dirty: {
      immediate: true,
      handler(newVal) {
        this.$emit('status', { name: 'dirty', value: newVal });
      }
    },
    pristine: {
      immediate: true,
      handler(newVal) {
        this.$emit('status', { name: 'pristine', value: newVal });
      }
    },
    invalid: {
      immediate: true,
      handler(newVal) {
        this.$emit('status', { name: 'invalid', value: newVal });
      }
    },
    valid: {
      immediate: true,
      handler(newVal) {
        this.$emit('status', { name: 'valid', value: newVal });
      }
    },
    isEmpty: {
      immediate: true,
      handler(newVal) {
        this.$emit('status', { name: 'isEmpty', value: newVal });
      }
    },
    isValidating: {
      immediate: true,
      handler(newVal) {
        this.$emit('status', { name: 'isValidating', value: newVal });
      }
    },
    isSubmitting: {
      immediate: true,
      handler(newVal) {
        this.$emit('status', { name: 'isSubmitting', value: newVal });
      }
    }
  },

  mounted() {
    this.isWrappingFilePicker = this.$el.querySelector('.el-form-item__content').children[0]?.children[0]?.classList.contains('el-file-picker');

    this.debounceValidate = debounce(DEBOUNCE_DELAY, false, (val) => {
      this.validate(val);
    });
    if (this.prop && this.elForm) {
      this.elForm.addField(this);

      this.resetInitialValue();

      const rules = this.allRules;

      eventBus.$on('el.form.focus', this.onFieldFocus);
      eventBus.$on('el.form.blur', this.onFieldBlur);

      if (rules.length || this.required !== undefined) {
        eventBus.$on('el.form.change', this.onFieldChange);
        eventBus.$on('el.form.input', this.onFieldInput);
      }
    }
  },

  beforeUnmount() {
    this.elForm.removeField(this);
  },

  methods: {
    validate(trigger, callback = noop, isSubmit = false) {
      this.validateDisabledByChange = false;
      this.validateDisabledByInput = false;
      const rules = this.getFilteredRule(trigger);
      if (isSubmit) {
        this.debounceValidateCancel();
      }
      if ((!rules || rules.length === 0) && this.required === undefined) {
        if (typeof this.error === 'boolean' && this.error) {
          this.errorMessages = [];
          this.errorMessage = '';
          this.validateState = 'error';
        } else if (Array.isArray(this.error) && this.error.length > 0) {
          this.errorMessages = this.error;
          this.errorMessage = this.error[0];
          this.validateState = 'error';
        } else if (this.error) { // typeof === string
          this.errorMessages = [this.error];
          this.errorMessage = this.error;
          this.validateState = 'error';
        }

        callback();
        return true;
      }

      this.validateState = 'validating';

      const descriptor = {};
      if (rules && rules.length > 0) {
        rules.forEach((rule) => {
          delete rule.trigger;
        });
      }
      descriptor[this.prop] = rules;

      const validator = new AsyncValidator(descriptor);
      const model = {};

      model[this.prop] = this.fieldValue;

      validator.validate(model, { firstFields: true }, (errors) => {
        if (errors) {
          this.validateState = 'error';

          this.errorMessages = errors.map((it) => it.message);
          this.errorMessage = this.errorMessages[0] || '';
        } else {
          this.validateState = 'success';
          this.errorMessages = [];
          this.errorMessage = '';
        }

        callback(this.errorMessage);
      });
    },

    clearValidate() {
      this.validateState = '';
      this.errorMessages = [];
      this.errorMessage = '';
      this.validateDisabledByChange = false;
      this.validateDisabledByInput = false;
    },

    resetField() {
      this.touched = false;
      this.validateState = '';
      this.errorMessages = [];
      this.errorMessage = '';

      const model = this.form.model;
      const value = this.fieldValue;
      let path = this.prop;
      if (path.indexOf(':') !== -1) {
        path = path.replace(/:/, '.');
      }

      const prop = getPropByPath(model, path, true);

      if (Array.isArray(value)) {
        this.validateDisabledByChange = true;
        this.validateDisabledByInput = true;
        prop.o[prop.k] = [].concat(this.initialValue);
      } else {
        this.validateDisabledByChange = true;
        this.validateDisabledByInput = true;
        prop.o[prop.k] = this.initialValue;
      }
    },

    getFilteredRule(trigger) {
      const rules = this.allRules;

      return rules
        .filter((rule) => {
          if (rule.trigger) {
            return rule.trigger.indexOf(trigger) !== -1;
          }
          return trigger === '' || 'blur debounce-input'.indexOf(trigger) !== -1;
        })
        .map((rule) => objectAssign({}, rule));
    },

    onFieldBlur() {
      this.isFocused = false;
      this.validate('blur');
    },

    onFieldFocus() {
      this.isFocused = true;
      this.touched = true;
    },

    onFieldChange() {
      this.touched = true;
      if (this.validateDisabledByChange) {
        this.validateDisabledByChange = false;
        return;
      }
      this.validate('change');
    },

    onFieldInput() {
      this.touched = true;
      if (this.validateDisabledByInput) {
        this.validateDisabledByInput = false;
        return;
      }
      this.debounceValidate('debounce-input');
    },

    debounceValidateCancel() {
      this.debounceValidate && this.debounceValidate.cancel();
      this.debounceValidate = debounce(DEBOUNCE_DELAY, false, (val) => {
        this.validate(val);
      });
    },

    resetInitialValue() {
      const value = this.fieldValue;
      this.initialValue = Array.isArray(value) ? [].concat(value) : value;
    }
  }
};
</script>
