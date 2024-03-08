import { sortData } from 'packages/table/src/table-utils';

export default {
  setData(states, data) {
    states.__rawData = data?.slice() || [];
    states.dataLength = data ? data.length : 0;

    const preparedData = data?.slice() || [];

    states.data = preparedData;

    if (this.table.rowsGroups.length > 0) {
      this.table.updateGroupedData();
    } else {
      const { sortingColumn, sortProp, sortOrder } = states;
      states.data = sortData({ data: preparedData, sortingColumn, sortProp, sortOrder });
    }
    this.updateCurrentRowData();

    this.execQuery();
    // Data changes, update some data.
    // Instead of using computed, some data is updated manually
    // https://github.com/vuejs/vue/issues/6660#issuecomment-331417140
    this.updateCurrentRowData();
    this.updateTableScrollY();
  },

  sort(states, options) {
    const { prop, order, init } = options;
    if (prop) {
      const columnToSort = this.table.columns.find((column) => column.prop === prop);
      if (columnToSort) {
        columnToSort.order = order;
      }
      this.updateSort(columnToSort, prop, order);
      this.commit('changeSortCondition', { init });
    }
  },

  changeSortCondition(states, options) {
    // Repair pr https://github.com/ElemeFE/element/pull/15012 caused by bug
    const { sortingColumn: column, sortProp: prop, sortOrder: order } = states;
    const { rowsGroups } = this.table;

    if (order === null) {
      states.sortingColumn = null;
      states.sortProp = null;
    }
    const ignore = { filter: true };

    if (rowsGroups.length > 0) {
      this.table.updateGroupedData();
    } else {
      this.execQuery(ignore);
    }

    if (!options || !(options.silent || options.init)) {
      this.table.$emit('sort-change', {
        column,
        prop,
        order
      });
    }

    this.updateTableScrollY();
  },

  filterChange(states, options) {
    const { column, values, silent } = options;
    const newFilters = this.updateFilters(column, values);

    this.execQuery();

    if (!silent) {
      this.table.$emit('filter-change', newFilters);
    }

    this.updateTableScrollY();
  },

  setHoveredRow(states, row) {
    states.hoveredRow = row;
  },

  setCurrentRow(states, row) {
    this.updateCurrentRow(row);
  },

  moveCurrentRow(states, step, row) {
    const oldCurrentRow = states.currentRow;
    const oldCurrentRowIndex = states.data.indexOf(states.currentRow === null ? row : states.currentRow);
    const newCurrentRowIndex = oldCurrentRowIndex + step;
    const rowHeight = this.table.rowHeight;
    const newCurrentRow = states.data[newCurrentRowIndex] || oldCurrentRow;
    if (newCurrentRow !== oldCurrentRow) {
      states.currentRow = newCurrentRow;
      this.table.$emit('current-change', newCurrentRow, oldCurrentRow);
      this.scrollIntoCurrentRow(newCurrentRowIndex, rowHeight);
    }
  }
};
