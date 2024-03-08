import eventBus from '@/utils/eventBus';

export default {
  props: {
    modelValue: {},
    label: {},
    name: String,
    disabled: Boolean,
    showHoverHint: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    focus: false,
    active: false
  }),

  computed: {
    radioGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'ElRadioGroup') {
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
        return this.radioGroup ? this.radioGroup.value : this.modelValue;
      },

      set(value) {
        if (this.radioGroup) {
          eventBus.$emit('el.radio.group.input', [value]);
        } else {
          this.$emit('update:modelValue', value);
        }
      }
    },

    isDisabled() {
      return this.radioGroup ? (this.radioGroup.disabled || this.disabled) : this.disabled;
    },

    isChecked() {
      return this.model === this.label;
    }
  },

  methods: {
    handleChange(event) {
      const { value } = event.target;
      this.$nextTick(() => {
        if (this.radioGroup) {
          eventBus.$emit('el.radio.group.handleChange', value);
        } else {
          this.$emit('change', value);
        }
      });
    },

    handleFocus() {
      this.focus = true;
    },

    handleBlur() {
      this.focus = false;
      this.active = false;
    }
  }
};
