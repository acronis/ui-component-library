import ElScrollbar from 'packages/scrollbar';
import eventBus from '@/utils/eventBus';

export default {
  name: 'ElDialogMask',

  components: {
    ElScrollbar
  },

  props: {
    position: {
      type: String,
      default: 'center'
    },
    scrollable: {
      type: Boolean,
      default: false
    },
    scrollAxis: {
      type: String,
      default: ''
    },
    fixedWidth: {
      type: Boolean,
      default: false
    }
  },

  emits: ['mask-mousedown'],

  created() {
    eventBus.$on('el.dialog.reset-scroll-position', this.resetScrollPosition);
  },

  methods: {
    handleWrapperMousedown(event) {
      if (event.target !== event.currentTarget) return;
      this.$emit('mask-mousedown', event);
    },
    resetScrollPosition() {
      if (this.$refs.scrollbar) {
        this.$refs.scrollbar.setPosition(0);
      }
    }
  },

  render() {
    if (this.scrollable) {
      return (
        <div class="el-dialog__mask">
          <el-scrollbar
            ref="scrollbar"
            class="el-dialog__outer-scroll"
            axis="outerScrollbarAxis"
            inverse
            outer-scroll
          >
            <div class="el-dialog__flex-wrapper">
              <div
                class={{
                  'el-dialog__outer-container': true,
                  [`is-position-${this.position}`]: true,
                  'is-scrollable': true,
                  'is-fixed-width': this.fixedWidth
                }}
                onMousedown={this.handleWrapperMousedown}
              >
                {this.$slots.default?.()}
              </div>
            </div>
          </el-scrollbar>
        </div>
      );
    }
    return (
      <div
        class={{
          'el-dialog__wrapper': true,
          [`is-position-${this.position}`]: true
        }}
        onMousedown={this.handleWrapperMousedown}>
        {this.$slots.default?.()}
      </div>
    );
  }
};
