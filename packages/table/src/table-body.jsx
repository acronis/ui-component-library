import { debounce } from 'throttle-debounce';

import ElCheckbox from 'packages/checkbox';
import { mapStates } from 'packages/table/src/store/helper';
import ElTooltip from 'packages/tooltip';

import RecycleScroller from './recycle-scroller.vue';
// import TableColumns from './table-columns.js';
import { ROW_HEIGHTS } from './table-constants';
import TableRow from './table-row.jsx';
import { getRowIdentity } from './table-utils';

export default {
  name: 'ElTableBody',

  components: {
    RecycleScroller,
    ElCheckbox,
    ElTooltip,
    // TableColumns,
    TableRow
  },

  props: {
    store: {
      required: true
    },
    height: Object,
    width: Object,
    triggerRerender: {
      type: [String, Number, Boolean, Function],
      required: false,
      default: undefined
    }
  },

  render() {
    let renderTableBody;

    if (this.table.withVirtualScroll) {
      renderTableBody = () => (
        <div class="el-table__scroll_list_wrapper" style={[this.height]}>
          <recycle-scroller
            items={this.renderList}
            item-size={this.rowSize}
            getScrollParent={this.getTableBodyScrollbarWrap}
            getItemKey={this.getVirtualRenderKey}
            fixedItemPosition={!this.table.expandSlot}
            scopedSlots={{
              default: ({ index, item }) => this.wrappedRowRender(item, index)
            }}
            triggerRerender={this.triggerRerender}
            ref="recycleScroller"
          >
          </recycle-scroller>
          {this.$slots.default}
        </div>
      );
    } else {
      renderTableBody = () => {
        const body = (
          <div class={{ 'el-table__body': true }} style={[this.width]}>
            {/* TODO remove table-columns */}
            <table-columns columns={this.table.visibleColumns}/>
            {this.renderList && (<div
              ref="body"
              class="el-table__tbody">
              {
                this.renderList.reduce((acc, row) => acc.concat(this.wrappedRowRender(row, acc.length)), [])
              }
            </div>)}
          </div>
        );
        if (this.$slots.default != null) {
          return (
            <div class="el-table__list_wrapper" style={[this.height]}>
              {body}
              {this.$slots.default()}
            </div>
          );
        }
        return body;
      };
    }

    return renderTableBody();
  },

  computed: {
    ...mapStates({
      tableData: 'data',
      totalRows: 'dataLength',
      currentRow: 'currentRow',
      rowKey: 'rowKey'
    }),

    table() {
      return this.store.table;
    },

    rowsGroups() {
      return this.table.rowsGroups;
    },

    groupedData() {
      return this.table.groupedData;
    },

    recycleScroller() {
      return this.$refs.recycleScroller;
    },

    renderList() {
      // return fake table data in case of skeleton rendering
      if (this.skeleton) {
        return this.skeletonData;
      }

      const { rowsGroups, groupedData } = this.table;
      if (rowsGroups.length === 0) {
        return this.tableData;
      }
      let firstHeaderRowHide = false;
      return groupedData.reduce((acc, currentGroup, curIndex) => {
        const currentRowsGroup = rowsGroups[curIndex];
        if (currentRowsGroup) {
          if (currentGroup.length === 0 && !currentRowsGroup.alwaysShown) {
            return acc;
          }
          if (!firstHeaderRowHide) {
            firstHeaderRowHide = true;
          } else {
            acc.push(currentRowsGroup);
          }
          if (currentRowsGroup.currentCollapsed) {
            return acc;
          }
          if (currentRowsGroup.collapseLoading) {
            acc.push({
              id: `loadingRow_${curIndex}`,
              loadingRow: true,
              content: currentRowsGroup
            });
            return acc;
          }
        }
        acc.push(...currentGroup);
        if (currentRowsGroup?.$slots.footer) {
          acc.push({
            id: `footer_${curIndex}`,
            footer: true,
            content: currentRowsGroup
          });
        }
        return acc;
      }, []);
    },

    /**
     * Returns row size (height)
     *
     * @return {number|null}
     */
    rowSize() {
      const {
        table,
        skeleton
      } = this;
      const { rowHeight } = table;

      if (skeleton && rowHeight === null) {
        return table.minItemSize || ROW_HEIGHTS.default;
      }

      return rowHeight;
    },

    /**
     * Returns value of skeleton flag
     *
     * @return {boolean}
     */
    skeleton() {
      return this.table.cSkeleton;
    },

    /**
     * Returns fake data for rendering skeleton
     *
     * @return {Object[]}
     */
    skeletonData() {
      // in our case all rows will have the same size (height)
      // so, we can avoid complicate calculation of items count

      let /** type string */ height = this.height.height;

      // sometime height can be `undefined` or empty string, show 1 row
      if (typeof height === 'undefined' || height.length === 0) {
        height = '1';
      }

      const count = this.totalRows || Math.ceil(parseInt(height, 10) / this.rowSize) || 1;
      const data = new Array(count);

      // fill array by empty objects
      // (by the way all iterate methods ignore holes in array and returns empty array, for example `map`)
      for (let i = 0; i < count; i++) {
        data[i] = {};
      }

      return data;
    }
  },

  watch: {
    currentRow(newVal, oldVal) {
      if (!newVal) return;
      if (this.$refs.list) {
        const newRowIndex = this.tableData.indexOf(newVal);
        this.$refs.list.scrollIntoView(newRowIndex);
      }

      if (this.rowKey && oldVal && newVal) {
        const newValKey = this.getKeyOfRow(newVal);
        const oldValKey = this.getKeyOfRow(oldVal);
        if (newValKey === oldValKey) return;
      }

      this.$nextTick(this.focusCurrentRow);
    },

    skeleton(newVal) {
      const { recycleScroller } = this.$refs;

      if (newVal && recycleScroller) {
        // we need to scroll to first item because our fake data can be outside of scroller view
        recycleScroller.scrollToItem(0);
      }
    }
  },

  created() {
    this.focusCurrentRow = debounce(50, function () {
      const children = this.$refs.list ? this.$refs.list.$children : this.$children;
      children.forEach((vm) => {
        if (vm.row === this.currentRow) {
          vm.$el && vm.$el.focus && vm.$el.focus();
        }
      });
    });
  },

  async mounted() {
    await this.$nextTick();

    const element = this.$el.querySelector('.el-table__body') || this.$el;
    element.style.tableLayout = 'fixed';
  },

  methods: {
    getTableBodyScrollbarWrap() {
      return this.table.bodyScrollbarWrap;
    },

    getVirtualRenderKey(row) {
      // table-rows-group
      if (row._isVue) {
        return row._uid;
      }
      // table-row
      return this.getKeyOfRow(row);
    },

    getKeyOfRow(row) {
      const { rowKey } = this.table;

      return getRowIdentity(row, rowKey);
    },

    rowRender(row, $index, treeRowData) {
      const output = [];
      let display = true;
      if (treeRowData) {
        display = treeRowData.display;
      }
      // The command v-show will override the display in row-style
      // Use :style instead of v-show https://github.com/ElemeFE/element/issues/16995
      const displayStyle = display ? null : {
        display: 'none'
      };
      const key = this.getKeyOfRow(row);
      const {
        rowIsSelectable,
        rowIsDisabled,
        isRowSelected,
        isRowInSelectableGroup,
        isRowGroupSelected,
        rowsGroups,
        rowsGroupMap,
        updateGroupRenderedRows
      } = this.table;

      if (row?.loadingRow) {
        return row.content.renderLoadingRow();
      }
      if (row?.footer) {
        return row.content.renderFooterRow();
      }
      if (row._isVue && row.$options.name === 'ElTableRowsGroup') {
        const groupRowData = row.getGroupRowData?.();

        // TODO check if rowGroup data exists or exists slots
        output.push(
          (groupRowData ? (<table-row
            style={[displayStyle]}
            class={['el-table__rows-group-header', ...row.bgColorClass]}
            key={key}
            row-index={$index}
            row-key={key}
            row={groupRowData}
            rowIsSelected={!!isRowGroupSelected(row.groupId)}
            rowIsSelectable={true}
            rowIsGroup={true}
            rowGroup={row}
            store={this.store}
            treeRowData={treeRowData}
          />) : row.renderGroupHeaderAsTableRow())
        );

        return output;
      }

      let groupId = null;
      if (rowsGroups.length > 0 && key) {
        groupId = isRowInSelectableGroup(key);
      }
      const rowGroup = rowsGroupMap[groupId];

      const rows = [
        <table-row
          style={[displayStyle]}
          key={key}
          row-index={$index}
          row-key={key}
          row={row}
          rowGroup={rowGroup}
          rowIsSelected={isRowSelected(key)}
          rowIsSelectable={rowIsSelectable(row, $index)}
          rowIsDisabled={rowIsDisabled(row, $index)}
          store={this.store}
          treeRowData={treeRowData}
        />,
        this.renderExpandedRow(row, $index, key)
      ];

      if (updateGroupRenderedRows) {
        updateGroupRenderedRows(groupId, key, rows);
      }

      return output.concat(rows);
    },

    renderExpandedRow(row, $index, key) {
      const { expandSlot, isRowExpanded, visibleColumns } = this.table;
      if (!!expandSlot && isRowExpanded(row)) {
        return (<tr key={`expanded-row__${key}`}>
          <td colSpan={visibleColumns.length} class="el-table__expanded-cell">
            {expandSlot({ row, $index })}
          </td>
        </tr>);
      }
    },

    wrappedRowRender(row, $index) {
      const {
        treeData, lazyTreeNodeMap, childrenColumnName, rowKey, __assertRowKey
      } = this.table;
      const renderedRow = [];

      if (Object.keys(treeData).length) {
        __assertRowKey();
        // For TreeTable, the rowKey must be set by the user and not calculated using getKeyOfRow
        // When calling the rowRender function,
        // the rowKey is still calculated, as it might be placed in non-reactive data
        // which is not a good operation
        const key = getRowIdentity(row, rowKey);
        let cur = treeData[key];
        let treeRowData = null;
        if (cur) {
          treeRowData = {
            expanded: cur.expanded,
            level: cur.level,
            display: true
          };
          if (typeof cur.lazy === 'boolean') {
            if (typeof cur.loaded === 'boolean' && cur.loaded) {
              treeRowData.noLazyChildren = !(cur.children && cur.children.length);
            }
            treeRowData.loading = cur.loading;
          }
        }
        renderedRow.push(this.rowRender(row, $index, treeRowData));
        // Render nested data
        if (cur) {
          // currentRow records the index,
          // so you need to actively increase the index of the TreeTable
          let i = 0;
          const traverse = (children, parent) => {
            if (!(children && children.length && parent)) return;
            children.forEach((node) => {
              // The display state of the parent node affects the display state of the child node
              const level = parent.level + 1;
              const innerTreeRowData = {
                display: parent.display && parent.expanded,
                level,
                isLeaf: node[this.table.lazyColumnIdentifier || 'hasChildren'] ? false : !node.children?.length,
                indent: level * this.table.indent
              };
              const childKey = getRowIdentity(node, rowKey);
              if (childKey === undefined || childKey === null) {
                throw new Error('for nested data item, row-key is required.');
              }
              cur = { ...treeData[childKey] };
              // For the current node, it is divided into two cases with or without child nodes。
              // If it contains child nodes, set the expanded attribute。
              // The display property of its child nodes is determined by its own expanded and display。
              if (cur) {
                innerTreeRowData.expanded = cur.expanded;
                // Some nodes lazily loaded,
                // the level is unknown
                cur.level = cur.level || innerTreeRowData.level;
                cur.display = !!(cur.expanded && innerTreeRowData.display);
                if (typeof cur.lazy === 'boolean') {
                  if (typeof cur.loaded === 'boolean' && cur.loaded) {
                    innerTreeRowData.noLazyChildren = !(cur.children && cur.children.length);
                  }
                  innerTreeRowData.loading = cur.loading;
                }
              }
              i++;
              renderedRow.push(this.rowRender(node, $index + i, innerTreeRowData));
              if (cur) {
                const nodes = lazyTreeNodeMap[childKey] || node[childrenColumnName];
                traverse(nodes, cur);
              }
            });
          };
          // For the root node, display must be true
          cur.display = true;
          const nodes = lazyTreeNodeMap[key] || row[childrenColumnName];
          traverse(nodes, cur);
        }
      } else {
        renderedRow.push(this.rowRender(row, $index));
      }

      return renderedRow;
    }
  }
};
