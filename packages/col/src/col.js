import { h } from 'vue';

export default {
  name: 'ElCol',

  props: {
    span: {
      type: Number,
      default: 24
    },
    row: {
      type: Number,
      default: 1
    },
    rowSpan: {
      type: Number,
      default: 1
    },
    col: {
      type: Number,
      default: 1
    },
    colSpan: {
      type: Number,
      default: 1
    },
    tag: {
      type: String,
      default: 'div'
    },
    offset: Number,
    pull: Number,
    push: Number,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object]
  },

  computed: {
    parent() {
      let parent = this.$parent;
      while (parent && parent.$options.componentName !== 'ElRow') {
        parent = parent.$parent;
      }
      return parent;
    },
    isGrid() {
      return this.parent?.isGrid;
    },
    gutter() {
      return this.parent ? this.parent.gutter : 0;
    }
  },
  render() {
    const classList = [];
    const style = {};

    if (!this.isGrid && this.gutter) {
      style.paddingLeft = `${this.gutter / 2}px`;
      style.paddingRight = style.paddingLeft;
    }

    if (this.isGrid) {
      classList.push([
        {
          [`el-grid--col-span-${this.colSpan}`]: this.colSpan,
          [`el-grid--row-span-${this.rowSpan}`]: this.rowSpan,
          [`el-grid--row-start-${this.row}`]: this.row,
          [`el-grid--col-start-${this.col}`]: this.col
          // [`el-grid--col-end-${this.col + this.colSpan}`]: this.col && this.colSpan
        }
      ]);
    } else {
      ['span', 'offset', 'pull', 'push'].forEach((prop) => {
        if (this[prop] || this[prop] === 0) {
          classList.push(prop !== 'span'
            ? `el-col-${prop}-${this[prop]}`
            : `el-col-${this[prop]}`);
        }
      });
    }

    ['xs', 'sm', 'md', 'lg', 'xl'].forEach((size) => {
      if (typeof this[size] === 'number') {
        classList.push(`el-col-${size}-${this[size]}`);
      } else if (typeof this[size] === 'object') {
        const props = this[size];
        Object.keys(props).forEach((prop) => {
          classList.push(prop !== 'span'
            ? `el-col-${size}-${prop}-${props[prop]}`
            : `el-col-${size}-${props[prop]}`);
        });
      }
    });

    return h(this.tag, {
      class: ['el-col', classList],
      style
    }, this.$slots.default?.());
  }
};
