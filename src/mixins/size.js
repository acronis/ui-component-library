export default {
  props: {
    size: String
  },

  computed: {
    computedSize() {
      const { elFormItemSize } = this.elFormItem || {};
      const { size } = this;

      return size || this.groupSize || elFormItemSize;
    },

    groupSize() {
      const { computedSize } = this.radioGroup || this.checkboxGroup || {};
      return computedSize;
    }
  }
};
