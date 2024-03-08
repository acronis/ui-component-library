import { h } from 'vue';

export default {
  name: 'ElRow',

  componentName: 'ElRow',

  props: {
    align: {
      type: String,
      default: 'top',
    },
    cols: Number,
    gutter: Number,
    justify: {
      type: String,
      default: 'start',
    },
    rows: Number,
    tag: {
      type: String,
      default: 'div',
    },
    type: {
      type: String,
    },
  },

  computed: {
    style() {
      const ret = {};

      if (!this.isGrid && this.gutter) {
        ret.marginLeft = `-${this.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }

      return ret;
    },
    classes() {
      return [
        'el-row',
        ...[(this.isFlex && {
          'el-row--flex': this.type === 'flex',
        })],
        ...[(!this.isGrid && {
          [`is-justify-${this.justify}`]: this.justify !== 'start',
          [`is-align-${this.align}`]: this.align !== 'top',
        })],
        ...[(this.isGrid && {
          'el-row--grid': true,
          'el-grid': true,
          [`el-grid--rows-${this.rows}`]: this.rows,
          [`el-grid--cols-${this.cols}`]: this.cols,
          [`el-grid--gap-${this.gutter}`]: this.gutter,
        })],
      ];
    },
    isGrid() {
      return this.type === 'grid' || this.rows || this.cols;
    },
    isFlex() {
      return this.type === 'flex';
    },
  },

  render() {
    return h(this.tag, {
      class: this.classes,
      style: this.style,
    }, this.$slots.default?.());
  },
};
