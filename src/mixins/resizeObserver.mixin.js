export default {
  data() {
    return {
      width: null,
      height: null,
      observer: null,
      resizableContainer: null
    };
  },
  mounted() {
    this.resizableContainer = this.$refs.resizableContainer;
    // initialize the observer on mount
    this.initObserver();
  },
  beforeDestroy() {
    if (this.observer) this.observer.disconnect();
  },
  methods: {
    initObserver() {
      const observer = new ResizeObserver(this.onResize);
      observer.observe(this.$refs.resizableContainer);
      this.observer = observer;
    },
    onResize() {
      const { resizableContainer } = this;

      if (resizableContainer) {
        const width = `${resizableContainer.offsetWidth}px`;
        const height = `${resizableContainer.offsetHeight}px`;

        this.width = width;
        this.height = height;

        this.$emit('resize', { width, height });
      }
    }
  }
};
