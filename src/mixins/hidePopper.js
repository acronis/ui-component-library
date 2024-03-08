export default {
  props: {
    hideOnScroll: {
      type: Boolean,
      default: true
    },
    hideOnResize: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    hidePopper() {
      this.$emit('onHidePopper');
    }
  }
};
