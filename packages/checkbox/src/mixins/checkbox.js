export default {
  props: {
    value: {},
    label: {},
    name: String,
    trueLabel: [String, Number],
    falseLabel: [String, Number],
    disabled: Boolean,
    checked: Boolean,
    showHoverHint: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    selfModel: false,
    isLimitExceeded: false
  }),

  computed: {
    checkboxGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'ElCheckboxGroup') {
          parent = parent.$parent;
        } else {
          return parent;
        }
      }
      return null;
    },

    tabIndex() {
      return this.isDisabled ? -1 : 0;
    },

    model: {
      get() {
        if (this.checkboxGroup) {
          return this.checkboxGroup.modelValue;
        }
        return this.modelValue === undefined ? this.selfModel : this.modelValue;
      },

      set(val) {
        if (this.checkboxGroup) {
          this.isLimitExceeded = false;
          (this.checkboxGroup.min !== undefined
            && val.length < this.checkboxGroup.min
            && (this.isLimitExceeded = true));

          (this.checkboxGroup.max !== undefined
            && val.length > this.checkboxGroup.max
            && (this.isLimitExceeded = true));

          this.isLimitExceeded === false
          && this.dispatch('ElCheckboxGroup', 'input', [val]);
        } else if (this.modelValue !== undefined) {
          this.$emit('input', val);
        } else {
          this.selfModel = val;
        }
      }
    },

    isDisabled() {
      return this.checkboxGroup ? (this.checkboxGroup.disabled || this.disabled) : this.disabled;
    },

    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model;
      }
      if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1;
      }
      return this.model === this.trueLabel;
    }
  },

  watch: {
    checked(newValue) {
      this.model = newValue;
    }
  },

  created() {
    this.checked && this.select();
  },

  methods: {
    handleChange(event) {
      if (this.isLimitExceeded) return;
      let value;
      if (event.target.checked) {
        value = this.trueLabel === undefined ? true : this.trueLabel;
      } else {
        value = this.falseLabel === undefined ? false : this.falseLabel;
      }
      this.$emit('change', value, event);
      this.$nextTick(() => {
        if (this.checkboxGroup) {
          this.dispatch('ElCheckboxGroup', 'handleChange', [this.checkboxGroup.modelValue]);
        }
      });
    },

    select() {
      if (Array.isArray(this.model)) {
        if (this.model.indexOf(this.label) === -1) {
          this.model.push(this.label);
        }
      } else {
        this.model = this.trueLabel || true;
      }
    }
  }
};
