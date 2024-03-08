import draggable from 'vuedraggable';

import convertToRows from 'packages/table/src/utils/convertToRows.util';

// import TableColumns from './table-columns.vue';
import TableHeaderCell from './table-header-cell.jsx';
import { getColumnOffsetStyles } from './table-utils';

export default {
  name: 'ElTableHeader',
  components: {
    TableHeaderCell,
    // TableColumns,
    draggable
  },
  props: {
    store: {
      required: true
    }
  },
  data() {
    return {
      dragBy: ['id'],
      enableColDrag: false,
      isBeingResized: false
    };
  },
  computed: {
    table() {
      return this.store.table;
    },

    // TODO use table computed stuckedRowsGroup
    stuckedRowsGroup() {
      return this.table.rowsGroups.filter((rowsGroup) => rowsGroup.stuck
        && (rowsGroup.groupData.length || rowsGroup.alwaysShown))[0];
    }
  },
  mounted() {
    this.$nextTick(() => {
      const element = this.$el.querySelector('.el-table__head') || this.$el;
      element.style.tableLayout = 'fixed';
    });
  },
  methods: {
    handleDragEnd(event) {
      if (event?.target) {
        event.target.classList.remove('is-dragging');
      }
      this.table.colReordering = false;
      for (const e of this.table.$el.querySelectorAll('th.is-draggable')) {
        e.classList.remove('is-dragging-cell');
      }
      this.table.reorderColumn(event);
    },

    async handleDragStart(event) {
      if (event?.target) {
        event.target.classList.add('is-dragging');
      }
      this.table.colReordering = true;
      const curDragI = event.oldDraggableIndex;
      await this.$nextTick();
      this.table.$el.querySelectorAll('th.is-draggable')[curDragI].classList.add('is-dragging-cell');
      this.table.$el.querySelector('.is-dragging').childNodes[this.table.$el.querySelector('.is-dragging').childNodes.length - 1].classList.add('is-dragging-item');
    },

    getHeaderRowStyle(rowIndex) {
      const { headerRowStyle } = this.table;
      if (typeof headerRowStyle === 'function') {
        return headerRowStyle.call(null, { rowIndex });
      }
      return headerRowStyle;
    },

    getHeaderRowClass(rowIndex) {
      const classes = ['el-table__head_row'];

      const { headerRowClassName, hasSelectableKeys } = this.table;
      if (hasSelectableKeys) {
        classes.push('is-selectable');
      }
      if (typeof headerRowClassName === 'string') {
        classes.push(headerRowClassName);
      } else if (typeof headerRowClassName === 'function') {
        classes.push(headerRowClassName.call(null, { rowIndex }));
      }

      return classes.join(' ');
    },

    // TODO remove duplication
    getHeaderCellStyle(rowIndex, columnIndex, row, column, isStickyPolyfill, isStub) {
      const { headerCellStyle } = this.table;
      let styles = {};

      if (typeof headerCellStyle === 'function') {
        styles = headerCellStyle.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        });
      } else if (headerCellStyle) {
        Object.assign(styles, headerCellStyle);
      }

      if (!isStub) {
        Object.assign(styles, getColumnOffsetStyles(this.table.visibleColumns, columnIndex));
      }

      if (isStickyPolyfill && column.fixed === 'right') {
        styles.transform = `translateX(${this.table.getFixedOffsetParent()}px)`;
      }

      return styles;
    },

    getHeaderCellClass(rowIndex, columnIndex, row, column, isStickyPolyfill, isStub, isGroup) {
      const classes = [column.id, column.order, column.headerAlign, column.className, column.labelClassName];

      if (!isStub && column.fixed) {
        classes.push('is-sticky');

        if (isStickyPolyfill) {
          classes.push('ie-sticky-polyfill');
          classes.push(`ie-sticky-polyfill-${column.fixed === 'right' ? 'right' : 'left'}`);
        }
      }

      if (this.table.colReorderable && !isGroup && column.labelClassName !== 'is-actions-column' && !column.fixed && (!column.type || (column.type && column.type === 'default'))) {
        classes.push('is-draggable');
      }

      if (column.isLastScrollableColumn) {
        classes.push('is-last-scroll-column');
      }

      if (column.isLastColumn || column.isLastScrollableColumn) {
        classes.push('is-last-column');
      }

      if (!column.children) {
        classes.push('is-leaf'); // TODO useless
      }

      if (column.sortable) {
        classes.push('is-sortable');
      }

      const { headerCellClassName } = this.table;
      if (typeof headerCellClassName === 'string') {
        classes.push(headerCellClassName);
      } else if (typeof headerCellClassName === 'function') {
        classes.push(headerCellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        }));
      }

      return classes.join(' ');
    }
  },
  render() {
    const columnRows = convertToRows(this.table.originColumns);

    const isGroup = columnRows.length > 1;
    // TODO fix implicit isGroup assignment
    if (isGroup) this.$parent.isGroup = true;

    const renderHeaderCell = (columns, column, cellIndex, rowIndex, isStickyPolyfill) => {
      const key = (isStickyPolyfill ? 'sticky-polyfill-' : '') + (column.id || column.name || column.prop); // TODO use column.id after fixing sorting by prop
      const isStub = column.fixed && this.table.requireStickyPolyfill && !isStickyPolyfill;

      return (<table-header-cell
        key={key}
        isStub={isStub}
        cellIndex={cellIndex}
        column={column}
        store={this.store}
        rowIndex={rowIndex}
        rowCount={columnRows.length}
        style={this.getHeaderCellStyle(rowIndex, cellIndex, columns, column, isStickyPolyfill, isStub)}
        class={this.getHeaderCellClass(rowIndex, cellIndex, columns, column, isStickyPolyfill, isStub, isGroup)}
      />);
    };

    if (!this.table.colReorderable || isGroup) {
      return (
        <table class="el-table__head">
          <table-columns columns={this.table.visibleColumns} />
          <thead class={[{ 'el-table__thead': true, 'is-group': isGroup }]}>
            {
              columnRows.map((columns, rowIndex) => (
                <tr
                  style={this.getHeaderRowStyle(rowIndex)}
                  class={this.getHeaderRowClass(rowIndex)}
                >
                  {this.table.requireStickyPolyfill && columns
                    .reduce((result, column, cellIndex) => (column.fixed
                      ? result.concat(renderHeaderCell(columns, column, cellIndex, rowIndex, true))
                      : result), [])
                  }
                  {
                    columns.map((column, cellIndex) => renderHeaderCell(columns, column, cellIndex, rowIndex))
                  }
                </tr>
              ))
            }
            {this.stuckedRowsGroup?.renderGroupHeaderAsTableRow({ renderAtHeader: true })}
          </thead>
        </table>
      );
    }
    return (
      <table class="el-table__head">
        <table-columns columns={this.table.visibleColumns} />
        <thead class={[{ 'el-table__thead': true, 'is-group': isGroup }]}>
          {
            columnRows.map((columns, rowIndex) => (
              <tr
                style={this.getHeaderRowStyle(rowIndex)}
                class={this.getHeaderRowClass(rowIndex)}
              >
                {this.table.requireStickyPolyfill && columns
                  .reduce((result, column, cellIndex) => (column.fixed
                    ? result.concat(renderHeaderCell(columns, column, cellIndex, rowIndex, true))
                    : result), [])
                }
                <draggable
                  disabled={this.enableColDrag || this.isBeingResized}
                  list={columns}
                  preventOnFilter={false}
                  forceFallback={true}
                  on-start={this.handleDragStart}
                  on-end={this.handleDragEnd}
                  v-model={this.dragBy}
                  draggable=".is-draggable"
                >
                  {
                    columns.map((column, cellIndex) => renderHeaderCell(columns, column, cellIndex, rowIndex))
                  }
                </draggable>
              </tr>
            ))
          }
          {this.stuckedRowsGroup?.renderGroupHeaderAsTableRow({ renderAtHeader: true })}
        </thead>
      </table>
    );
  }
};
