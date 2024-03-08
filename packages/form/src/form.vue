<template>
  <form
    class="el-form"
    :class="className"
    @submit.prevent="handleSubmit()"
  >
    <slot />
  </form>
</template>

<script>
export default {
  name: 'ElForm',

  componentName: 'ElForm',

  provide() {
    return {
      elForm: this
    };
  },

  props: {
    inlineMessage: {
      type: Boolean,
      default: true
    },
    model: Object,
    rules: Object,
    loading: Boolean,
    showMessage: {
      type: Boolean,
      default: true
    },
    hints: Object
  },

  emits: ['status', 'error', 'submit'],

  data: () => ({ fields: [] }),

  computed: {
    touched() {
      return this.fields.filter((it) => it.touched).length > 0;
    },
    untouched() {
      return !this.touched;
    },
    dirty() {
      return this.fields.filter((it) => it.dirty).length > 0;
    },
    pristine() {
      return !this.dirty;
    },
    invalid() {
      // isEmpty field is added so that form is invalid until all required fields are not empty
      return this.fields.filter((it) => it.invalid).length > 0
          || (this.fields.filter((it) => it.isEmpty).length > 0 && !this.pristine);
    },
    valid() {
      return !this.invalid;
    },
    isValidating() {
      return this.fields.filter((it) => it.isValidating).length > 0;
    },
    isSubmitting() {
      return this.loading;
    },
    className() {
      return {
        'is-valid': this.valid,
        'is-invalid': this.invalid,
        'is-touched': this.touched,
        'is-untouched': this.untouched,
        'is-dirty': this.dirty,
        'is-pristine': this.pristine,
        'is-validating': this.isValidating,
        'is-submitting': this.isSubmitting
      };
    }
  },

  watch: {
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
    },
    rules() {
      this.$nextTick(() => {
        this.validate(() => null);
      });
    }
  },

  methods: {
    resetFields() {
      /* istanbul ignore if */
      if (!this.model) {
        process.env.NODE_ENV !== 'production'
            && console.warn('[Element Warn][Form]model is required for resetFields to work.');
        return;
      }
      this.fields.forEach((field) => {
        field.resetField();
      });
    },

    clearValidate() {
      this.fields.forEach((field) => {
        field.clearValidate();
      });
    },

    validate(callback) {
      /* istanbul ignore if */
      if (!this.model) {
        console.warn('[Element Warn][Form]model is required for validate to work!');
        return;
      }

      let promise;
      // if no callback, return promise
      if (typeof callback !== 'function' && window.Promise) {
        promise = new window.Promise((resolve, reject) => {
          // eslint-disable-next-line no-param-reassign
          callback = function (valid) {
            valid ? resolve(valid) : reject(valid);
          };
        });
      }

      let valid = true;
      let count = 0;

      if (this.fields.length === 0 && callback) {
        callback(true);
      }
      this.fields.forEach((field) => {
        field.validate('', (errors) => {
          if (errors) {
            valid = false;
          }
          if (typeof callback === 'function' && ++count === this.fields.length) {
            callback(valid);
          }
        }, true);
      });

      if (promise) {
        return promise;
      }
    },

    validateField(prop, cb) {
      const fieldForValidate = this.fields.filter((field) => field.prop === prop)[0];
      if (!fieldForValidate) { throw new Error('must call validateField with valid prop string!'); }

      fieldForValidate.validate('', cb);
    },

    handleSubmit() {
      this.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.model);
        } else {
          this.$emit('error');
        }
      });
    },

    addField(field) {
      if (field) {
        this.fields.push(field);
      }
    },

    removeField(field) {
      if (field.prop) {
        this.fields.splice(this.fields.indexOf(field), 1);
      }
    },

    resetInitialValue() {
      this.fields.forEach((field) => {
        field.resetInitialValue();
      });
    }
  }
};
</script>
