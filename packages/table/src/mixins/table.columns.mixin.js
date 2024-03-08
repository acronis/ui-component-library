import { doFlattenColumns } from 'packages/table/src/table-utils';
import { COLUMN_TYPES, COLUMN_ICON_WIDTH } from 'packages/table/src/table-constants';
import createColumn from 'packages/table/src/utils/table-column.util';

export default {
  props: {
    headerActionsIcon: {
      type: String,
      default: 'i-cog--16'
    },

    actionsIcon: {
      type: String,
      default: 'i-ellipsis-h--16'
    },

    showColumnsSelector: {
      type: Boolean,
      default: true
    },

    disableColumnsSelector: {
      type: Boolean,
      default: false
    },

    selectableColumnsFilter: {
      type: Function,
      default: () => true
    },

    rowActions: {
      type: Array,
      default: () => []
    },

    hideOnRowSelection: {
      type: Boolean,
      default: true
    },

    // TODO support columnId to hide columns
    initialHiddenColumns: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      colReordering: false,

      columnsTree: [], // Columns hierarchy
      originColumns: [], // flattenColumns reordered in left-fixed, non-fixed, right-fixed. Used to calculate header grid layout
      columns: [], // flattenColumns without parent columns
      hasFixedColumns: false // Whether to include fixed columns and highlight table rows
    };
  },

  computed: {
    visibleColumns() {
      return this.columns.filter((c) => !c.hidden);
    }
  },
  async mounted() {
    this.initializeColumns();

    await this.$nextTick();
    this.initialHiddenColumns.forEach((columnProp) => this.changeColumnVisibility(columnProp, true));
  },
  methods: {
    changeColumnVisibility(columnKey, hidden) {
      const updatedColumn = this.columns.find((column) => column.columnKey === columnKey);

      if (updatedColumn) {
        this.$set(updatedColumn, 'hidden', hidden);
        this.$emit('column-visibility-change', updatedColumn, hidden);
        this.updateColumnState({ column: updatedColumn });
        this.doLayout();
        this.$nextTick(() => {
          this.syncFixedColumns(this.scrollLeft);
          this.updateWrapperScroll();
        });
      }
    },

    insertColumn(column, index, parent, scheduleLayoutOptions) {
      let array = this.columnsTree;

      if (parent) {
        array = parent.children;

        if (!array) {
          array = [];
          parent.children = array;
        }
      }

      if (typeof index !== 'undefined') {
        array.splice(index, 0, column);
      } else {
        array.push(column);
      }

      if (column.type === COLUMN_TYPES.SELECTION) {
        this.reserveSelection = column.reserveSelection;

        if (column.defaultSelectAll) {
          this.selectAllRows();
        }

        // TODO remove with deprecated `selectable` column property
        if (column.selectable) {
          this.selectable = column.selectable;
        }
      }

      if (this.$ready) {
        this.updateColumns(); // hack for dynamics insert column
        this.scheduleLayout(scheduleLayoutOptions);
      }
    },

    removeColumn(column, parent, scheduleLayoutOptions) {
      let array = this.columnsTree;
      if (parent) {
        array = parent.children;
        if (!array) {
          array = [];
          parent.children = array;
        }
      }
      if (array) {
        array.splice(array.indexOf(column), 1);
      }

      if (this.$ready) {
        this.updateColumns(); // hack for dynamics remove column
        this.scheduleLayout(scheduleLayoutOptions);
      }
    },

    // TODO add columns normalization
    updateColumns() {
      const { columnsTree = [] } = this;
      // TODO get fixed from this.columns
      const fixedColumns = columnsTree.filter((column) => column.fixed === true || column.fixed === 'left');
      const rightFixedColumns = columnsTree.filter((column) => column.fixed === 'right');

      if (
        fixedColumns.length > 0
        && columnsTree[0]?.type === COLUMN_TYPES.SELECTION
        && !columnsTree[0].fixed
      ) {
        columnsTree[0].fixed = true;
        fixedColumns.unshift(columnsTree[0]);
      }

      const notFixedColumns = columnsTree.filter((column) => !column.fixed);
      const leafColumns = doFlattenColumns(notFixedColumns, 'ScrollableColumn');
      const fixedLeafColumns = doFlattenColumns(fixedColumns, 'FixedColumn');
      const rightFixedLeafColumns = doFlattenColumns(rightFixedColumns, 'FixedRightColumn');

      this.originColumns = [].concat(fixedColumns, notFixedColumns, rightFixedColumns);
      this.columns = doFlattenColumns([].concat(fixedLeafColumns, leafColumns, rightFixedLeafColumns), 'Column');
      this.hasFixedColumns = fixedColumns.length > 0 || rightFixedColumns.length > 0;
    },

    // Update DOM
    scheduleLayout(needUpdateColumns) {
      if (needUpdateColumns) {
        this.updateColumns();
      }
      this.debouncedUpdateLayout();
    },

    reorderColumn(event) {
      const array = this.columnsTree;
      const oldI = event.oldIndex;
      const newI = event.newIndex;
      if (oldI !== newI) {
        const a = array[oldI];
        array.splice(oldI, 1);
        array.splice(newI, 0, a);
        if (this.$ready) {
          this.updateColumns();
          this.scheduleLayout({ nextTick: true });
          this.$emit('column-order-change', {
            array
          });
        }
      }
    },

    initializeColumns() {
      if (Array.isArray(this.$props.cols)) {
        this.$props.cols.forEach((column, columnIndex) => {
          let cloneColumn = Object.assign({}, column);

          if (
            (cloneColumn.type && [COLUMN_TYPES.SELECTION, COLUMN_TYPES.ACTIONS].includes(cloneColumn.type))
            && !cloneColumn.prop
          ) {
            cloneColumn = {
              ...cloneColumn,
              width: COLUMN_ICON_WIDTH,
              minWidth: COLUMN_ICON_WIDTH
            };
          }
          const newColumn = createColumn(
            { index: columnIndex, ...cloneColumn },
             this.tableId
          );
          this.insertColumn(newColumn, columnIndex);
        });
      }
    }
  }
};
