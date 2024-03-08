<template>
  <div
    class="el-checkbox-group"
    :class="{
      'is-invalid': isInvalid
    }"
    role="group"
    aria-label="checkbox-group"
  >
    <div class="el-checkbox-group__content">
      <slot />
    </div>
  </div>
</template>

<script>
  import Size from '@/mixins/size';
  import eventBus from '@/utils/eventBus';

  export default {
  name: 'ElCheckboxGroup',

  componentName: 'ElCheckboxGroup',

  mixins: [
    Size
  ],

  inject: {
    elFormItem: {
      default: {}
    }
  },

  props: {
    modelValue: {},
    disabled: Boolean,
    min: Number,
    max: Number
  },

  emits: ['change'],

  computed: {
    isInvalid() {
      return this.elFormItem.validateState === 'error';
    }
  },

  watch: {
    value(value) {
      eventBus.$emit('el.form.change', [value]);
      eventBus.$emit('el.form.input', [value]);
      // this.dispatch('ElFormItem', 'el.form.change', [value]);
      // this.dispatch('ElFormItem', 'el.form.input', [value]);
    }
  },

  created() {
    eventBus.$on('el.checkbox.group.handleChange', (value) => {
      this.$emit('change', value);
    });
  }
};
</script>
