export default {
  data() {
    return {
      hoverOption: -1
    };
  },

  computed: {
    optionsAllDisabled() {
      return this.options.length === this.options.filter((item) => item.disabled === true).length;
    }
  },

  watch: {
    hoverIndex(val) {
      this.hoverOption = this.options[val] || {};
      this.options.forEach((option) => {
        option.hover = this.hoverOption === option;
      });
    }
  },

  methods: {
    clearHover() {
      this.hoverIndex = -1;
      this.hoverOption = -1;
    },

    navigateOptions(direction) {
      if (!this.visible) {
        this.visible = true;
        return;
      }
      if (this.options.length === 0 || this.filteredOptionsCount === 0 || this.tree) {
        return;
      }
      if (!this.optionsAllDisabled) {
        if (direction === 'next') {
          this.hoverIndex++;
          if (this.hoverIndex === this.options.length) {
            this.hoverIndex = 0;
          }
        } else if (direction === 'prev') {
          this.hoverIndex--;
          if (this.hoverIndex < 0) {
            this.hoverIndex = this.options.length - 1;
          }
        }
        if (this.hoverIndex >= this.options.length) {
          this.hoverIndex = 0;
        }
        const option = this.options[this.hoverIndex];
        if (option.disabled === true
          || option.groupDisabled === true
          || !option.visible) {
          this.navigateOptions(direction);
        }
      }
      this.$nextTick(() => this.scrollToOption(this.hoverOption));
    }
  }
};
