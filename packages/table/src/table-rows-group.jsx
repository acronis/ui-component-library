import { getCurrentInstance, h } from 'vue';
import ElButton from 'packages/button';
import ElCheckbox from 'packages/checkbox';
import ElIcon from 'packages/icon';
import { findParentComponentByName } from 'packages/table/src/utils/findParentComponent.util';
import TableRow from './table-row';

export default {
  name: 'ElTableRowsGroup',

  components: {
    ElButton,
    ElCheckbox,
    ElIcon,
    TableRow
  },

  props: {
    collapseLoading: {
      type: Boolean,
      default: false
    },
    collapseLoadingText: {
      type: String,
      default: ''
    },
    alwaysShown: {
      type: Boolean,
      default: false
    },
    backgroundColor: {
      type: String,
      default: 'brand-accent'
    },
    className: {
      type: String
    },
    collapsible: {
      type: Boolean,
      default: false
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    collapseButtonDisabled: {
      type: Boolean,
      default: false
    },
    rowGroupItemsAreSelectable: {
      type: Boolean,
      default: true
    },
    rowGroupIsSelectable: {
      type: Boolean,
      default: false
    },
    groupKey: {
      type: String,
      default: null
    },
    groupValue: {
      type: null,
      default: null
    },
    customGroupMethod: Function,
    id: String,
    slotName: String,
    owner: Object,
    getRowGroupData: Function,
    groupRow: Object,
    slots: { type: Object, default: () => ({}) }
  },

  data() {
    return {
      groupId: null,
      currentCollapsed: false
    };
  },
  computed: {
    table() {
      return findParentComponentByName(this, 'ElTable') || this.owner;
    },
    stuck() {
      return this.table.stuckRowsGroup === this;
    },
    defaultFilterMethod() {
      return (item) => item[this.groupKey] === this.groupValue;
    },
    filterMethod() {
      return this.customGroupMethod || this.defaultFilterMethod;
    },
    groupData() {
      return this.table?.tableData.filter(this.filterMethod);
    },
    isBackgroundColorInPresets() {
      return this._backgroundPresets.indexOf(this.backgroundColor) !== -1;
    },
    rowStyle() {
      return this.isBackgroundColorInPresets ? {} : { backgroundColor: this.backgroundColor };
    },
    rowClass() {
      const {
        rowGroupIsSelectable,
        groupId,
        className,
        collapsible,
        currentCollapsed
      } = this;

      const {
        isRowGroupSelected
      } = this.table;

      return {
        'el-table__rows-group-header': true,
        'is-selectable': rowGroupIsSelectable,
        'is-selected': isRowGroupSelected(groupId),
        'is-collapsible': collapsible,
        'is-collapsed': currentCollapsed,
        [className]: !!className
      };
    },

    clientWidth() {
      return `${this.table.layout.clientWidth}px`;
    },

    // TODO use fixed column in table row group content instead of ie-sticky-polyfill
    classNames() {
      return [
        'el-table__cell',
        'is-bordered-bottom',
        // always use sticky-polyfill to handle the group content
        'is-sticky',
        'ie-sticky-polyfill',
        'ie-sticky-polyfill-left'
      ];
    },

    bgColorClass() {
      return [
        {
          [`el-table__rows-group-header-bg--color-${this.backgroundColor}`]: this.isBackgroundColorInPresets
        }
      ];
    }
  },

  watch: {
    groupData() {
      this.table.updateRowsGroup();
    },
    collapsed: {
      handler(newVal) {
        this.currentCollapsed = newVal;
      },
      immediate: true
    }
  },

  created() {
    this._backgroundPresets = [
      'brand-light',
      'brand-accent',
      'brand-lightest',
      'fixed-white'
    ];

    const {
      classNames
    } = this;

    const renderWithWrapper = (
      children,
      rowClass = this.rowClass,
      rowStyle = this.rowStyle
    ) => {
      const columnsLength = this.table.visibleColumns.length;
      let width = this.clientWidth;

      if (width === '0px') {
        width = '100%';
      } else {
        width = this.clientWidth;
      }
      return (
        <tr
          class={['el-table__row', rowClass, this.bgColorClass]}
          style={rowStyle}
        >
          <th
            class={classNames}
            colspan={columnsLength}
            style={{ width, left: 0 }}
          >{children}</th>
        </tr>
      );
    };

    this.renderGroupHeaderAsTableRow = (renderProp = {}) => {
      const {
        renderAtHeader = false
      } = renderProp;

      const {
        bgColorClass,
        collapseButtonDisabled,
        collapsible,
        getGroupRowData,
        groupData,
        groupId,
        rowClass,
        rowGroupIsSelectable,
        slotName,
        stuck,
        toggleCollapsed,
        groupRow
      } = this;

      const {
        default: defaultOptionSlot,
        [slotName]: customOptionSlot
      } = this.slots;

      const {
        isRowGroupSelected,
        isRowGroupSomeSelected,
        selectableGroups,
        selectionEnabled,
        selectRowGroup,
        store,
        $slots
      } = this.table;

      const groupRowData = groupRow || getGroupRowData?.();

      const {
        cell_group: cellGroupSlot,
        cell_group_header: cellGroupHeaderSlot,
        [slotName]: customCellGroupSlot
      } = $slots;

      // TODO check rowGroup in row group component
      const slotData = { groupId, groupData, rowGroup: this };

      // TODO use method in table-body to remove duplicates
      if ((!stuck || renderAtHeader) && groupRowData) {
        return (<table-row
          class={[rowClass, bgColorClass]}
          row={groupRowData}
          rowIndex={0}
          rowIsSelected={!!isRowGroupSelected(groupId)}
          rowIsSelectable={true}
          rowIsGroup={true}
          rowGroup={this}
          store={store}
        />);
      }

      const checkboxDisabled = !selectableGroups[groupId]?.length;
      const showGroupSelection = (selectionEnabled || rowGroupIsSelectable);

      const content = (!stuck || renderAtHeader) ? (
        <div class="el-table__rows-group-header-content">
          {
            collapsible
            && <el-button
              type="ghost"
              class={showGroupSelection ? 'mr-8' : 'mr-16'}
              disabled={collapseButtonDisabled}
              onClick={toggleCollapsed}>
              <el-icon
                name="i-chevron-down--16"
                class="el-table__row-group-header-collapse-icon"/>
            </el-button>
          }
          {
            showGroupSelection && <el-checkbox
              title=""
              class={{
                'el-table__selection-cell-checkbox-wrapper': true,
                'is-disabled': checkboxDisabled
              }}
              nativeOn-click={(event) => event.stopPropagation()}
              value={isRowGroupSelected(groupId)}
              indeterminate={!!isRowGroupSomeSelected(groupId)}
              disabled={checkboxDisabled}
              on-input={() => selectRowGroup(groupId)}
            />
          }
          {
            (customOptionSlot && typeof customOptionSlot === 'function' && customOptionSlot(slotData))
            || (defaultOptionSlot && typeof defaultOptionSlot === 'function' && defaultOptionSlot(slotData))
            || (typeof customCellGroupSlot === 'function' && customCellGroupSlot(slotData))
            || (typeof cellGroupSlot === 'function' && cellGroupSlot(slotData))
            || (typeof cellGroupHeaderSlot === 'function' && cellGroupHeaderSlot(slotData))
            || (typeof this.$slots.default === 'function' && this.$slots.default(slotData))
            || null
          }
        </div>
      ) : null;

      return renderWithWrapper(content);
    };

    this.renderWithRowWrapper = (content) => {
      const columnsLength = this.table.visibleColumns.length;
      const width = this.clientWidth;
      return (
        <tr class="el-table__rows-group-row">
          <td
            class={classNames}
            colspan={columnsLength}
            style={{ width, left: '0' }}
          >
            { content }
          </td>
        </tr>
      );
    };

    this.renderLoadingRow = () => {
      const content = (
        <div class="el-table__rows-group-loading">
          <el-loading color="brand-primary" class="mr-8"></el-loading>
          <span> { this.collapseLoadingText } </span>
        </div>
      );
      return this.renderWithRowWrapper(content);
    };

    this.renderFooterRow = () => this.renderWithRowWrapper(this.$slots.footer({ groupData: this.groupData }));
  },

  mounted() {
    const uid = getCurrentInstance().uid;
    this.groupId = this.id || `rowGroup_${uid}`;
    this.table.insertRowsGroup(this);
  },

  updated() {
    const { table } = this;
    const index = [].indexOf.call(table.$refs.hiddenColumns.children, this.$el);

    table.updateRowsGroup(this, index);
  },

  unmounted() {
    this.table.removeRowsGroup(this);
  },

  methods: {
    toggleCollapsed() {
      this.currentCollapsed = !this.currentCollapsed;
      this.$emit('collapse-change', this.currentCollapsed, this);
      this.$nextTick(() => {
        this.table.updateBodyScrollbar();
      });
    },
    setStuck(isStuck) {
      const value = isStuck ? this : null;
      if (this.table.stuckRowsGroup !== value) {
        this.table.setStuckRowsGroup(value);
      }
    },
    getGroupRowData() {
      if (!this.getRowGroupData) return;

      return this.getRowGroupData({ row: this, groupId: this.groupId });
    }
  },

  render() {
    return h('div', {
      attrs: {
        'data-el-name': 'ElTableRowsGroup',
        'data-group-key': this.groupKey,
        'data-group-value': this.groupValue,
        'data-custom-group-method': this.customGroupMethod
      }
    });
  }
};

