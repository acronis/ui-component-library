import { on, off } from '@/utils/dom';
import { renderThumbStyle, renderBarStyle, BAR_MAP } from './util';

export default {
  name: 'Bar',

  props: {
    vertical: Boolean,
    size: String,
    move: Number,
    dropdown: Boolean,
    start: Number,
    end: Number,
    outerScroll: Boolean
  },

  computed: {
    bar() {
      return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
    },

    wrap() {
      return this.$parent.wrap;
    }
  },

  unmounted() {
    off(document, 'mouseup', this.mouseUpDocumentHandler);
  },

  methods: {
    clickThumbHandler(e) {
      this.startDrag(e);
      this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction])); // eslint-disable-line max-len
    },

    clickTrackHandler(e) {
      const minSize = 40;
      const thumbSize = this.$refs.thumb[this.bar.offset];
      const barSize = this.$el[this.bar.offset];
      const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
      const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
      // Calculate scrollTop value for scrollbars larger than minimum size
      const thumbPositionPercentage = (offset - thumbHalf) * 100 / this.$el[this.bar.offset];
      const thumbScrollTop = thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100;
      // Calculate scrollTop value for scrollbars smaller or equal to minimum size
      const minThumbPositionPercent = ((offset - thumbHalf) * 100 / (this.$el[this.bar.offset] - thumbSize));
      const minThumbScrollTop = minThumbPositionPercent * (this.wrap[this.bar.scrollSize] - barSize) / 100;
      this.wrap[this.bar.scroll] = thumbSize <= minSize ? minThumbScrollTop : thumbScrollTop;
    },

    startDrag(e) {
      e.stopImmediatePropagation();
      this.cursorDown = true;

      on(document, 'mousemove', this.mouseMoveDocumentHandler);
      on(document, 'mouseup', this.mouseUpDocumentHandler);
      document.onselectstart = () => false;
    },

    mouseMoveDocumentHandler(e) {
      e.preventDefault();
      if (this.cursorDown === false) return;
      const prevPage = this[this.bar.axis];

      if (!prevPage) return;

      const minSize = 40;
      const thumbSize = this.$refs.thumb[this.bar.offset];
      const barSize = this.$el[this.bar.offset];
      const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
      const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
      // Calculate scrollTop value for scrollbars larger than minimum size
      const thumbPositionPercentage = (offset - thumbClickPosition) * 100 / this.$el[this.bar.offset];
      const thumbScrollTop = thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100;
      // Calculate scrollTop value for scrollbars smaller or equal to minimum size
      const minThumbPositionPercent = ((offset - thumbClickPosition) * 100 / (this.$el[this.bar.offset] - thumbSize));
      const minThumbScrollTop = minThumbPositionPercent * (this.wrap[this.bar.scrollSize] - barSize) / 100;
      this.wrap[this.bar.scroll] = thumbSize <= minSize ? minThumbScrollTop : thumbScrollTop;
    },

    mouseUpDocumentHandler() {
      this.cursorDown = false;
      this[this.bar.axis] = 0;
      off(document, 'mousemove', this.mouseMoveDocumentHandler);
      document.onselectstart = null;
    }
  },

  render() {
    const {
      size, move, bar, start, end
    } = this;

    return (
      <div
        class={ ['el-scrollbar__bar', `is-${bar.key}`, this.dropdown ? 'is-dropdown' : ''] }
        onMousedown={ this.clickTrackHandler }
        style={ renderBarStyle({ start, end, bar }) }>
        <div
          ref="thumb"
          class={['el-scrollbar__thumb', this.outerScroll ? 'el-scrollbar__outer-scroll' : '']}
          onMousedown={ this.clickThumbHandler }
          style={ renderThumbStyle({ size, move, bar }) }>
        </div>
      </div>
    );
  }
};
