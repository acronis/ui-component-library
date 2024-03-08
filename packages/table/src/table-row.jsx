import { mapStates } from 'packages/table/src/store/helper';
import { findParentComponentByName } from 'packages/table/src/utils/findParentComponent.util';

import TableCell from './table-cell';
import { getCell, getColumnByCell, getColumnOffsetStyles } from './table-utils';

export default {
  name: 'ElTableRow',
  components: {
    TableCell
  },
  props: {
    rowKey: {
      type: [String, Number]
    },
    row: {
      type: Object,
      required: true
    },
    'row-index': {
      type: Number,
      required: true
    },
    rowIsSelected: Boolean,
    rowIsSelectable: Boolean,
    rowIsDisabled: Boolean,
    rowIsGroup: Boolean,
    rowGroup: Object,
    treeRowData: Object,
    store: Object
  },
  data() {
    return {
      isHovered: false,
      renderCells: false
    };
  },
  created() {
    if (this.table.withVirtualScroll && this.table.virtualScrollRenderTimeout) {
      this.renderTimeout = setTimeout(() => {
        this.renderCells = true;
      }, this.table.virtualScrollRenderTimeout);
    } else {
      this.renderCells = true;
    }
  },
  render() {
    const renderTableCell = (column, cellIndex, isStickyPolyfill = false) => {
      const key = isStickyPolyfill ? `sticky-polyfill-${column.id}` : column.id;
      const isStub = column.fixed && this.table.requireStickyPolyfill && !isStickyPolyfill;
      return (
        <table-cell
          key={key}
          isStub={isStub}
          cellIndex={cellIndex}
          column={column}
          row={this.row}
          rowIndex={this.rowIndex}
          rowKey={this.rowKey}
          rowIsSelectable={this.rowIsSelectable}
          rowIsDisabled={this.rowIsDisabled}
          rowIsSelected={this.rowIsSelected}
          rowIsGroup={this.rowIsGroup}
          rowGroup={this.rowGroup}
          rowTree={this.firstDefaultColumnIndex === cellIndex && this.treeRowData}
          renderCellBody={this.renderCells || this.rowIndexIsBelowVirtualScroll}
          store={this.store}
          style={this.getCellStyle(this.rowIndex, cellIndex, this.row, column, isStickyPolyfill, isStub)}
          class={this.getCellClass(this.rowIndex, cellIndex, this.row, column, isStickyPolyfill, isStub)}>
        </table-cell>
      );
    };

    return (
      <div
        on-click={ ($event) => this.handleClick($event, this.row) }
        on-dblclick={ ($event) => this.handleEvent($event, this.row, 'dblclick') }
        on-keydown={ this.handleKeydown }
        on-mouseenter={ () => this.setMouseHover(true) }
        on-mouseleave={ () => this.setMouseHover(false) }
        tabindex={ this.table.highlightCurrentRow ? 0 : -1 }
        class={ this.rowClassNames }
        style={ this.table.rowStyle ? this.getRowStyle(this.row, this.rowIndex) : null }
      >
        {this.table.requireStickyPolyfill && this.table.visibleColumns
          .reduce((result, column, cellIndex) => (column.fixed
            ? result.concat(renderTableCell(column, cellIndex, true))
            : result), [])
        }
        {
          this.table.visibleColumns.map((column, cellIndex) => renderTableCell(column, cellIndex))
        }
      </div>
    );
  },
  computed: {
    ...mapStates({
      currentRow: 'currentRow'
    }),
    table() {
      return findParentComponentByName(this, 'ElTable') || this.store.table;
    },
    isCurrent() {
      return this.table.highlightCurrentRow
        && this.row
        && this.currentRow === this.row;
    },
    firstDefaultColumnIndex() {
      return this.table.visibleColumns.findIndex(({ type }) => type === 'default');
    },
    isRowSelectionEnabled() {
      return this.rowIsSelectable && this.table.selectByRow;
    },
    rowPropClassNames() {
      const { rowClassName } = this.table;
      const {
        row,
        rowIndex
      } = this;

      if (typeof rowClassName === 'string') {
        return { [rowClassName]: true };
      }

      if (typeof rowClassName === 'function') {
        const className = rowClassName.call(null, {
          row,
          rowIndex
        });

        return { [className]: true };
      }

      return { [rowClassName]: true };
    },
    rowClassNames() {
      const {
        currentRow,
        isCurrent,
        isHovered,
        isRowSelectionEnabled,
        row,
        rowIndex,
        rowIsSelectable,
        rowIsDisabled,
        rowIsSelected,
        rowPropClassNames,
        treeRowData
      } = this;
      const {
        expandRows,
        highlightCurrentRow,
        stripe
      } = this.table;

      return {
        'el-table__row': true,
        'el-table__row--striped': stripe && rowIndex % 2 === 1,
        'is-selected': rowIsSelected,
        'is-hovered': isHovered,
        'is-current': isCurrent,
        'is-highlightable': highlightCurrentRow,
        'is-selectable': rowIsSelectable,
        'is-disabled': rowIsDisabled,
        'is-multi-selection-mode': isRowSelectionEnabled,
        'current-row': highlightCurrentRow && row === currentRow,
        expanded: expandRows.indexOf(row) > -1,
        ...(treeRowData && { [`el-table__row--level-${treeRowData.level}`]: true }),
        ...rowPropClassNames
      };
    },
    // TODO remove or fix rowIndexes in rowGroups
    rowIndexIsBelowVirtualScroll() {
      return this.rowIndex <= this.table.virtualRenderLimit;
    }
  },
  methods: {
    handleClick(event, row) {
      if (this.table.highlightCurrentRow) {
        this.store.commit('setCurrentRow', this.isCurrent ? null : row);
      } else if (this.isRowSelectionEnabled) {
        this.table.toggleRowSelection(row, !this.table.selectedKeys.includes(this.table.getRowKey(row)));
      }

      this.handleEvent(event, row, 'click');
    },

    handleEvent(event, row, name) {
      const { table } = this;
      const cell = getCell(event);
      let column;
      if (cell) {
        column = getColumnByCell(table.columns, cell);

        if (column) {
          table.$emit(`cell-${name}`, row, column, cell, event);
        }
      }
      table.$emit(`row-${name}`, row, event, column);
    },

    handleKeydown(e) {
      if (!this.table.highlightCurrentRow || e.target !== this.$el) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        this.store.commit('moveCurrentRow', step, this.row);
      }

      if (e.key === ' ') {
        e.preventDefault();
        this.store.commit('setCurrentRow', this.isCurrent ? null : this.row);
      }
    },

    setMouseHover(hovered) {
      this.toogleDisabledRowsTooltip(hovered);

      if (!this.rowIsSelectable) return;
      this.isHovered = hovered;
      this.store.commit('setHoveredRow', hovered ? this.row : null);
    },

    toogleDisabledRowsTooltip(show) {
      const rowTooltipText = this.table.getRowTooltipText(this.row, this.rowIndex);

      show && rowTooltipText.length && !this.rowIsSelectable
        ? this.table.showTooltip(this.$el, rowTooltipText)
        : this.table.hideTooltip();
    },

    getCellStyle(rowIndex, columnIndex, row, column, isStickyPolyfill, isStub) {
      const { cellStyle } = this.table;
      let styles = {};

      if (typeof cellStyle === 'function') {
        styles = cellStyle.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        });
      } else if (cellStyle) {
        Object.assign(styles, cellStyle);
      }

      if (!isStub) {
        Object.assign(styles, getColumnOffsetStyles(this.table.visibleColumns, columnIndex));
      }

      if (isStickyPolyfill && column.fixed === 'right') {
        styles.transform = `translateX(${this.table.getFixedOffsetParent()}px)`;
      }

      return styles;
    },

    getCellClass(rowIndex, columnIndex, row, column, isStickyPolyfill, isStub) {
      // TODO use columnKey in data-attributes
      const classes = [column.id, column.className];

      if (!isStub && column.fixed && isStickyPolyfill) {
        classes.push('ie-sticky-polyfill');
        classes.push(`ie-sticky-polyfill-${column.fixed === 'right' ? 'right' : 'left'}`);
      }

      if (column.isLastScrollableColumn) {
        classes.push('is-last-scroll-column');
      }
      const { cellClassName } = this.table;
      if (typeof cellClassName === 'string') {
        classes.push(cellClassName);
      } else if (typeof cellClassName === 'function') {
        classes.push(cellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column
        }));
      }

      return classes.join(' ');
    },

    getRowStyle(row, rowIndex) {
      const { rowStyle } = this.table;
      if (typeof rowStyle === 'function') {
        return rowStyle.call(null, {
          row,
          rowIndex
        });
      }
      return [rowStyle, this.style];
    }
  }
};
