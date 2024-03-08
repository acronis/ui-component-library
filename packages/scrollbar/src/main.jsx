import { h } from 'vue';
import { addResizeListener, removeResizeListener } from '@/utils/resize-event';
import scrollbarWidth from '@/utils/scrollbar-width.js';
import { toObject } from '@/utils/util';
import { addClass, removeClass } from '@/utils/dom';
import Bar from './bar.jsx';

export default {
  name: 'ElScrollbar',

  components: { Bar },

  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean,
    tag: {
      type: String,
      default: 'div'
    },
    inverse: Boolean,
    outerScroll: Boolean,
    dropdown: Boolean,
    axis: String,
    offset: {
      type: Array,
      default: () => [0, 0, 0, 0],
      validator: (value) => value.length === 4
    },
    borderTopWhenScrolled: Boolean
  },

  emits: ['scroll', 'overflow-update'],

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0,
      gutter: null
    };
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    }
  },

  mounted() {
    if (this.native) return;
    this.$nextTick(this.update);
    // Add listener on component "el-scrollbar" instead of "el-scrollbar__view"
    // "el-scrollbar__view" has fixed height which unable to trigger ResizeObserver.
    // Add listener on component "el-scrollbar__view" to detect content resize.
    if (!this.noresize) {
      addResizeListener(this.$el, this.requestAnimationFrameUpdate);
      addResizeListener(this.$refs.resize, this.requestAnimationFrameUpdate);
    }
  },
  beforeUnmount() {
    if (this.native) return;
    if (!this.noresize) {
      removeResizeListener(this.$el, this.requestAnimationFrameUpdate);
      removeResizeListener(this.$refs.resize, this.requestAnimationFrameUpdate);
    }
  },

  methods: {
    handleScroll(event) {
      this.updateScrollPosition();
      this.$emit('scroll', event);
    },

    updateScrollPosition() {
      const wrap = this.wrap;
      if (this.borderTopWhenScrolled && wrap && wrap.scrollTop !== 0) {
        addClass(this.$el, 'is-bordered-top');
      } else if (this.borderTopWhenScrolled && wrap && wrap.scrollTop === 0) {
        removeClass(this.$el, 'is-bordered-top');
      }
      const minSize = 40;
      // if sizeHeight and sizeWidth is unavailable, use previous moveY and moveX as reference.
      if (!(this.sizeHeight === '' && this.sizeWidth === '')) {
        this.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
        this.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
      }
      const scrollHeight = Math.ceil(parseInt(this.sizeHeight, 10) / 100.0 * wrap.clientHeight);
      const scrollWidth = Math.ceil(parseInt(this.sizeWidth, 10) / 100.0 * wrap.clientWidth);
      if (scrollHeight <= minSize) {
        const scrollVerticalProgressPercentage = (wrap.scrollTop / (wrap.scrollHeight - wrap.clientHeight));
        const barScrollTopPercentage = scrollVerticalProgressPercentage * (wrap.clientHeight - minSize);
        // Translate percentage in translateY
        this.moveY = barScrollTopPercentage / minSize * 100;
      }
      if (scrollWidth <= minSize) {
        const scrollHorizontalProgressPercentage = (wrap.scrollLeft / (wrap.scrollWidth - wrap.clientWidth));
        const barScrollLeftPercentage = scrollHorizontalProgressPercentage * (wrap.clientWidth - minSize);
        // Translate percentage in translateX
        this.moveX = barScrollLeftPercentage / minSize * 100;
      }
    },

    update() {
      const wrap = this.wrap;
      if (!wrap) return;
      const minSize = 40;
      const boundClientRect = wrap.getBoundingClientRect();
      // Handle edge cases:
      // Prevent scrollbar showing when browser zoom rounds up widths & heights causing 1px excess.
      const isHeightOverflow = Math.abs(wrap.clientHeight - wrap.scrollHeight) > 1;
      const isWidthOverflow = Math.abs(wrap.clientWidth - wrap.scrollWidth) > 1;
      // Handle browser zoom width & height number rounds inconsistent.
      const isHeightAccurate = Math.abs(boundClientRect.height - wrap.offsetHeight) <= 1;
      const isWidthAccurate = Math.abs(boundClientRect.width - wrap.offsetWidth) <= 1;
      let widthPercentage = isWidthAccurate && isWidthOverflow
        ? (wrap.clientWidth * 100 / wrap.scrollWidth) : 100;
      let heightPercentage = isHeightAccurate && isHeightOverflow
        ? (wrap.clientHeight * 100 / wrap.scrollHeight) : 100;
      const minHeightPercentage = (minSize * 100 / wrap.clientHeight);
      const minwidthPercentage = (minSize * 100 / wrap.clientWidth);
      heightPercentage = (heightPercentage <= minHeightPercentage) ? (minHeightPercentage) : (heightPercentage);
      widthPercentage = (widthPercentage <= minwidthPercentage) ? (minwidthPercentage) : (widthPercentage);
      this.sizeHeight = (heightPercentage < 100 && wrap.scrollHeight > minSize) ? (`${heightPercentage}%`) : '';
      this.sizeWidth = (widthPercentage < 100 && wrap.scrollWidth > minSize) ? (`${widthPercentage}%`) : '';
      this.gutter = scrollbarWidth();

      // internal usage
      this.$emit('overflow-update', isHeightOverflow, isWidthOverflow);
    },

    setPosition(scrollTop, scrollLeft) {
      if (scrollTop !== undefined) {
        this.$refs.wrap.scrollTop = scrollTop;
      }
      if (scrollLeft !== undefined) {
        this.$refs.wrap.scrollLeft = scrollLeft;
      }
    },

    requestAnimationFrameUpdate() {
      return requestAnimationFrame(this.update);
    }
  },

  render() {
    this.gutter = this.gutter === null ? scrollbarWidth() : this.gutter;

    let axisStyle = 'el-scrollbar__wrap--axis';
    if (this.axis === 'disabled') axisStyle = '';
    if (this.axis === 'x') axisStyle = 'el-scrollbar__wrap--x-axis';
    if (this.axis === 'y') axisStyle = 'el-scrollbar__wrap--y-axis';
    let style = this.wrapStyle;
    if (this.gutter) {
      const gutterWidth = `-${this.gutter}px`;
      const gutterStyle = this.axis === 'disabled' ? 'height: 100%'
        : this.axis === 'x' ? `height: calc(100% + ${this.gutter}px); margin-bottom: ${gutterWidth};`
          : this.axis === 'y' ? `height: 100%; margin-right: ${gutterWidth};`
            : `height: calc(100% + ${this.gutter}px); margin-bottom: ${gutterWidth}; `
            + `margin-right: ${gutterWidth};`;

      if (Array.isArray(this.wrapStyle)) {
        style = toObject(this.wrapStyle);
        style.marginRight = gutterWidth;
        style.marginBottom = gutterWidth;
      } else if (typeof this.wrapStyle === 'string') {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    const view = h(this.tag, {
      class: ['el-scrollbar__view', this.viewClass],
      style: this.viewStyle,
      ref: 'resize'
    }, this.$slots.default?.());
    const wrap = (
      <div
        ref="wrap"
        style={ style }
        onScroll={ this.handleScroll }
        class={ [this.wrapClass, 'el-scrollbar__wrap', axisStyle, this.gutter ? '' : 'el-scrollbar__wrap--hidden-default'] }>
        { [view] }
      </div>
    );
    let nodes;

    if (!this.native) {
      nodes = ([
        wrap
      ]);
      const [top, right, bottom, left] = this.offset;
      if (this.axis !== 'disabled') {
        (axisStyle.indexOf('y-axis') === -1) && this.sizeWidth && nodes.push(<Bar
          outerScroll={this.outerScroll}
          move={ this.moveX }
          size={ this.sizeWidth }
          dropdown={ this.dropdown }
          start={ left }
          end={ right }></Bar>);
        (axisStyle.indexOf('x-axis') === -1) && this.sizeHeight && nodes.push(<Bar
          outerScroll={this.outerScroll}
          vertical
          move={ this.moveY }
          size={ this.sizeHeight }
          dropdown={ this.dropdown }
          start={ top }
          end={ bottom }></Bar>);
      }
    } else {
      nodes = ([
        <div
          ref="wrap"
          class={ [this.wrapClass, 'el-scrollbar__wrap'] }
          style={ style }>
          { [view] }
        </div>
      ]);
    }
    return h('div', { class: ['el-scrollbar', this.inverse ? 'is-inverse' : ''] }, nodes);
  }
};
