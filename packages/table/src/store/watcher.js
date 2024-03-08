import { createApp } from 'vue';
import merge from '@/utils/merge';
import { getColumnByKey, sortData } from '../table-utils';
import current from './current';

export default createApp({

  mixins: [current],

  data() {
    return {
      states: {
        // This property must be set after version 3.0
        rowKey: null,

        // The source of the rendered data is the result
        // of filtering and sorting the data in the table
        __rawData: [],
        data: [],
        dataLength: null,

        // filters
        filters: {}, // Unresponsive
        filteredData: null,

        // sorting
        sortingColumn: null,
        sortProp: null,
        sortOrder: null,

        // rows
        currentRow: null,
        hoveredRow: null
      }
    };
  },

  methods: {
    // Filter and sort
    updateFilters(columns, values) {
      const columnsArray = Array.isArray(columns) ? columns : [columns];
      const { states } = this;
      const filters = {};
      columnsArray.forEach((col) => {
        states.filters[col.columnKey] = values;
        filters[col.columnKey] = values;
      });

      return filters;
    },

    updateSort(column, prop, order) {
      if (this.states.sortingColumn && this.states.sortingColumn !== column) {
        this.states.sortingColumn.order = null;
      }
      this.states.sortingColumn = column;
      this.states.sortProp = prop;
      this.states.sortOrder = order;
    },

    execFilter() {
      const { data, filters } = this.states;
      let filteredData = data;

      Object.keys(filters).forEach((columnId) => {
        const filterValues = filters[columnId];
        const values = Array.isArray(filterValues) ? filterValues : [filterValues];

        if (!values || values.length === 0) return;

        const column = getColumnByKey({ columns: this.table.columns, columnValue: columnId });

        if (column && column.filterMethod) {
          filteredData = data.filter((row) => values.some((value) => column.filterMethod.call(null, value, row, column)));
        }
      });

      this.states.filteredData = filteredData;
    },

    execSort() {
      const {
        filteredData: data, sortingColumn, sortProp, sortOrder
      } = this.states;

      this.states.data = sortData({
        data, sortingColumn, sortProp, sortOrder
      });
    },

    // Filter data according to filters and sort
    execQuery(ignore) {
      if (!(ignore && ignore.filter)) {
        this.execFilter();
      }
      this.execSort();
    },

    clearFilter(columnKeys) {
      const states = this.states;
      const { tableHeader, fixedTableHeader, rightFixedTableHeader } = this.table.$refs;

      let panels = {};
      // TODO remove filterPanels
      if (tableHeader) panels = merge(panels, tableHeader.filterPanels);
      if (fixedTableHeader) panels = merge(panels, fixedTableHeader.filterPanels);
      if (rightFixedTableHeader) panels = merge(panels, rightFixedTableHeader.filterPanels);

      const keys = Object.keys(panels);
      if (!keys.length) return;

      if (typeof columnKeys === 'string') {
        // eslint-disable-next-line no-param-reassign
        columnKeys = [columnKeys];
      }

      if (Array.isArray(columnKeys)) {
        const columns = columnKeys.map((key) => getColumnByKey({ columns: states.table.columns, columnValue: key }));
        keys.forEach((key) => {
          const column = columns.find((col) => col.id === key);
          if (column) {
            // TODO: Optimize the code here
            panels[key].filteredValue = [];
          }
        });
        this.commit('filterChange', {
          column: columns,
          values: [],
          silent: true,
          multi: true
        });
      } else {
        keys.forEach((key) => {
          // TODO: Optimize the code here
          panels[key].filteredValue = [];
        });

        states.filters = {};
        this.commit('filterChange', {
          column: {},
          values: [],
          silent: true
        });
      }
    },

    clearSort() {
      const states = this.states;
      if (!states.sortingColumn) return;

      this.updateSort(null, null, null);
      this.commit('changeSortCondition', {
        silent: true
      });
    }
  }
});
