import { slot } from '@/utils/slot';
import { getColumnOffsetStyles } from 'packages/table/src/table-utils';
import { COLUMN_TYPES } from 'packages/table/src/table-constants';
import { findParentComponentByName } from 'packages/table/src/utils/findParentComponent.util';

export default {
  name: 'ElTd',
  props: {
    column: { type: Object, required: true },
    store: Object,
    isDisabled: Boolean,
    isExpandable: Boolean
  },
  computed: {
    table() {
      return findParentComponentByName(this, 'ElTable') || this.store.table;
    },
    hasBorderRight() {
      const { table, column } = this;

      return (column.isLastFixedColumn && table.layout.scrollX && table.scrollLeft > 0)
        || (column.border && column.borderPosition === 'right')
        || (table.hasBorderVertical && !column.isLastColumn);
    },
    hasBorderLeft() {
      const { table, column } = this;

      return (column.border && column.borderPosition === 'left')
        || (column.isFirstFixedRightColumn && table.layout.scrollX && !table.isScrollRight);
    },
    hasBorderBottom() {
      const t = this.table;
      return t.hasBorderHorizontal || t.borderBottom;
    },
    cellClasses() {
      const {
        column: c,
        table: t,
        hasBorderLeft,
        hasBorderRight,
        hasBorderBottom,
        isDisabled,
        isExpandable
      } = this;

      return {
        'el-table__cell': true,
        'is-align-right': !c.align && ['integer', 'float', 'number', 'numeric'].indexOf(c.type) > -1,
        'is-align-center': !c.align && ['bool', 'boolean', 'date', 'datetime'].indexOf(c.type) > -1,
        [`is-align-${c.align}`]: c.align,
        'is-selection': c.type === COLUMN_TYPES.SELECTION || c.showSelection || t.selectionEnabled,
        'is-index': c.type === COLUMN_TYPES.INDEX,
        'is-actions-column': c.type === COLUMN_TYPES.ACTIONS,
        'is-clickable': c.clickable,
        'is-bordered-right': hasBorderRight,
        'is-bordered-right-hidden': c.isLastFixedColumn && !hasBorderRight,
        'is-bordered-left': hasBorderLeft,
        'is-bordered-left-hidden': c.isFirstFixedRightColumn && !hasBorderLeft,
        'is-bordered-bottom': hasBorderBottom,
        'is-expandable': isExpandable,
        'is-column-hovered': (c.dragging || c.hovered) && !t.colReordering,
        'is-resizable': c.resizable,
        'is-sorted': !!c.order,
        'is-sticky': !!c.fixed,
        'is-disabled': isDisabled
      };
    },
    cellStyles() {
      const { realWidth, width, minWidth } = this.column;
      const cellWidth = realWidth || width || minWidth;

      return {
        width: cellWidth && `${cellWidth}px`,
        minWidth: minWidth && `${minWidth}px`,
        ...(getColumnOffsetStyles(this.table.visibleColumns, this.column.index))
      };
    }
  },
  render(h) {
    return h('div', {
      on: this.$listeners,
      class: this.cellClasses,
      style: this.cellStyles
    },
    slot(this, 'default'));
  }
};
