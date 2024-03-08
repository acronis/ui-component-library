export default {
  data() {
    return {
      isMouseDown: false,
      isActive: false,
      isFocus: false
    };
  },

  methods: {
    handleEnterKeyDown() {
      this.isActive = true;
    },

    handleEnterKeyUp() {
      this.isActive = false;
    },

    handleMouseDown() {
      this.isMouseDown = true;
    },

    handleMouseUp() {
      this.isMouseDown = false;
    },

    handleFocus() {
      if (!this.isMouseDown) {
        this.isFocus = true;
      }
    },

    handleBlur() {
      this.isMouseDown = false;
      this.isActive = false;
      this.isFocus = false;
    }
  }
};
