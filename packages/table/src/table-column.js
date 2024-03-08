import { COLUMN_MIN_WIDTH, COLUMN_TYPES, COLUMN_ICON_WIDTH } from './table-constants';
import { createColumn } from './utils/table-column.util';

let columnIdSeed = 1;

export const parseWidth = (newWidth, isMinWidth) => {
  let width = newWidth;
  if (width !== undefined) {
    width = parseInt(width, 10);
    if (Number.isNaN(width)) {
      width = isMinWidth ? COLUMN_MIN_WIDTH : null;
    }
  }
  return width;
};

export default {
  name: 'ElTableColumn',
  props: {
    align: String,
    autoWidth: { type: Boolean, default: false },
    border: Boolean,
    borderPosition: { type: String, default: 'right' },
    className: String,
    clickable: Boolean,
    col: { type: Object },
    columnKey: String,
    defaultSelectAll: Boolean,
    fixed: [Boolean, String],
    formatter: Function,
    headerAlign: String,
    hidden: { type: Boolean, default: false },
    hideCellContent: { type: Boolean, default: false },
    index: [Number, Function],
    label: String,
    labelClassName: String,
    minWidth: { type: [String, Number], default: COLUMN_MIN_WIDTH },
    name: { type: String },
    prop: String,
    property: String,
    renderBody: {
      type: Boolean,
      default: false
    },
    renderHeader: Function,
    reserveSelection: Boolean,
    resizable: { type: Boolean, default: false },
    searchable: Boolean,
    /**
     * @deprecated Use table property `is-selectable`
     */
    selectable: [Function, Boolean],
    showHint: Boolean,
    showOverflowTooltip: Boolean,
    disableOverflow: Boolean,
    showSelection: Boolean,
    showTree: Boolean,
    showExpand: Boolean,
    sortable: { type: [String, Boolean], default: false },
    sortBy: [String, Function, Array],
    sortMethod: Function,
    type: { type: String, default: 'default' },
    width: {
      type: [String, Number],
      validator: (width) => {
        const parsedWidth = parseInt(width, 10);
        if (!Number.isNaN(parsedWidth) && parsedWidth < 48) {
          console.warn('WARN: Table column width prop should not less than 48px');
          return false;
        }
        return true;
      }
    }
  },
  data() {
    return {
      isSubColumn: false,
      columnConfig: {},
      columns: [],
      dragging: false,
      hovered: false
    };
  },
  computed: {
    owner() {
      let parent = this.$parent;
      while (parent && !parent.tableId) {
        parent = parent.$parent;
      }
      return parent;
    },
    columnOrTableParent() {
      let parent = this.$parent;
      while (parent && !parent.tableId && !parent.columnId) {
        parent = parent.$parent;
      }
      return parent;
    }
  },

  watch: {
    label(newVal) {
      if (this.columnConfig) {
        this.columnConfig.label = newVal;
      }
    },

    align(newVal) {
      if (this.columnConfig) {
        this.columnConfig.align = newVal || null;

        if (!this.headerAlign) {
          this.columnConfig.headerAlign = newVal || null;
        }
      }
    },

    headerAlign(newVal) {
      if (this.columnConfig) {
        this.columnConfig.headerAlign = (newVal || this.align);
      }
    },

    className(newVal) {
      if (this.columnConfig) {
        this.columnConfig.className = newVal;
      }
    },

    width(newVal) {
      if (this.columnConfig) {
        this.columnConfig.width = parseWidth(newVal);
        this.owner.scheduleLayout();
      }
    },

    minWidth(newVal) {
      if (this.columnConfig) {
        this.columnConfig.minWidth = parseWidth(newVal, true);
        this.owner.scheduleLayout();
      }
    },

    fixed(newVal) {
      if (this.columnConfig) {
        this.columnConfig.fixed = newVal;
        this.owner.scheduleLayout({ updateColumns: true });
      }
    },

    sortable(newVal) {
      if (this.columnConfig) {
        this.columnConfig.sortable = newVal;
      }
    },

    index(newVal) {
      if (this.columnConfig) {
        this.columnConfig.index = newVal;
      }
    },

    formatter(newVal) {
      if (this.columnConfig) {
        this.columnConfig.formatter = newVal;
      }
    },

    border(newVal) {
      if (this.columnConfig) {
        this.columnConfig.border = newVal;
      }
    },

    clickable(newVal) {
      if (this.columnConfig) {
        this.columnConfig.clickable = newVal;
      }
    },

    hidden(newHidden) {
      if (newHidden) {
        this.removeSelf({ nextTick: true }, true);
      } else {
        this.insertSelf({ nextTick: true });
      }
    },

    hideCellContent(newVal) {
      if (this.columnConfig) {
        this.columnConfig.hideCellContent = newVal;
      }
    }
  },

  beforeCreate() {
    this.row = {};
    this.column = {};
    this.$index = 0;
  },
  created() {
    this.$options.render = (h) => h('div', this.$slots.default);

    const { owner, columnOrTableParent: parent } = this;
    this.isSubColumn = owner !== parent;
    this.columnId = `${parent.tableId || parent.columnId}_column_${columnIdSeed++}`;

    let width = parseWidth(this.width);
    let minWidth = parseWidth(this.minWidth, true);
    if (this.type === COLUMN_TYPES.SELECTION && !this.prop) {
      width = COLUMN_ICON_WIDTH;
      minWidth = COLUMN_ICON_WIDTH;
    }

    this.columnConfig = createColumn({
      align: this.align,
      autoWidth: this.autoWidth,
      border: this.border,
      borderPosition: this.borderPosition,
      className: this.className,
      clickable: this.clickable || this.owner.selectByRow,
      columnKey: this.columnKey,
      defaultSelectAll: this.defaultSelectAll,
      fixed: this.fixed,
      formatter: this.formatter,
      headerAlign: this.headerAlign,
      hideCellContent: this.hideCellContent,
      id: this.columnId,
      index: this.index,
      isSubColumn: this.isSubColumn,
      label: this.label,
      labelClassName: this.labelClassName,
      minWidth,
      parentColumnConfig: this.isSubColumn ? parent.columnConfig : null,
      prop: this.prop || this.property,
      renderBody: this.renderBody,
      renderCell: null,
      renderHeader: this.renderHeader,
      reserveSelection: this.reserveSelection,
      resizable: this.resizable,
      searchable: this.searchable,
      selectable: this.selectable,
      showHint: this.showHint,
      showExpand: this.showExpand,
      showSelection: this.showSelection,
      showTree: this.showTree,
      showOverflowTooltip: this.showOverflowTooltip,
      disableOverflow: this.disableOverflow,
      sortable: this.sortable,
      sortBy: this.sortBy,
      sortMethod: this.sortMethod,
      type: this.type,
      width
    });

    if (process.env.NODE_ENV !== 'production') {
      this.property && console.warn('[UI Kit Warn][Table-column] property is deprecated. Please use prop.');
    }
  },
  mounted() {
    this.columnConfig.scopedSlots = this.$scopedSlots;
    this.columnConfig.slots = this.$slots;

    this.$watch('columnConfig.scopedSlots', () => {
      if (this.type === 'expand' && !this.width) {
        this.columnConfig.width = COLUMN_MIN_WIDTH;
      }
    }, { immediate: 'true' });

    this.insertSelf = (scheduleLayoutOptions) => {
      const { owner } = this;
      const parent = this.columnOrTableParent;
      let columnIndex;

      if (!this.isSubColumn) {
        if (!parent.$refs.hiddenColumns) {
          return;
        }
        columnIndex = [].indexOf.call(parent.$refs.hiddenColumns.children, this.$el);

        const { rowsGroups } = owner;
        const rowsGroupsLength = rowsGroups.length;

        if (rowsGroupsLength) {
          columnIndex -= rowsGroupsLength;
        }
      } else {
        if (!parent.$el.children) {
          return;
        }
        columnIndex = [].indexOf.call(parent.$el.children, this.$el);
      }
      if (!this.columnConfig.index) { this.columnConfig.index = columnIndex; }

      owner.insertColumn(
        this.columnConfig,
        columnIndex,
        this.isSubColumn ? parent.columnConfig : null,
        scheduleLayoutOptions
      );
    };

    this.removeSelf = (scheduleLayoutOptions) => {
      const parent = this.$parent;
      this.owner.removeColumn(
        this.columnConfig,
        this.isSubColumn ? parent.columnConfig : null,
        scheduleLayoutOptions
      );
    };

     if (!this.hidden) {
       // if (!this.hidden && this.type !== COLUMN_TYPES.ACTIONS) {
      this.insertSelf();
    }
  },
  destroyed() {
    this.removeSelf();
  }
};
