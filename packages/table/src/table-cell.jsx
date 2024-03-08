import { h } from 'vue';

import ElCheckbox from 'packages/checkbox';
import ElTableActions from 'packages/table/src/table-actions.vue';
import { COLUMN_TYPES, COLUMN_ICON_WIDTH } from 'packages/table/src/table-constants';
import { findParentComponentByName } from 'packages/table/src/utils/findParentComponent.util';
import { getCellValue } from 'packages/table/src/utils/table-column.util.jsx';
import TooltipWrapper from 'packages/widgets/tooltip-wrapper';

import { getFocusableChildElements, noop } from './table-utils';
import ElTd from './td';

export default {
  name: 'ElTableCell',
  components: {
    ElCheckbox,
    ElTd,
    TooltipWrapper
  },
  props: {
    isStub: Boolean,
    cellIndex: Number,
    column: { type: Object, required: true },
    row: Object,
    rowIndex: [String, Number],
    rowKey: String,
    rowIsSelectable: Boolean,
    rowIsSelected: Boolean,
    rowIsDisabled: Boolean,
    rowIsGroup: Boolean,
    rowTree: [Object, Boolean],
    rowGroup: Object,
    renderCellBody: Boolean,
    store: Object
  },
  computed: {
    table() {
      return findParentComponentByName(this, 'ElTable') || this.store.table;
    },
    value() {
      return getCellValue({
        row: this.row,
        column: this.column,
        $index: this.rowIndex
      });
    },
    // TODO optimize recalculation
    withSelectionCheckbox() {
      const { selectionEnabled } = this.table;
      const { type, showSelection } = this.column;

      return type === COLUMN_TYPES.SELECTION
        || (this.cellIndex === 0 && (showSelection || selectionEnabled));
    }
  },
  beforeUnmount() {
    this.renderTimeout && clearTimeout(this.renderTimeout);
  },
  methods: {
    renderContent(content, hint, value) {
      const prefixElements = [];
      const cellContent = content;
      const {
        column,
        row,
        rowGroup,
        rowIsGroup,
        rowIsSelectable,
        rowIsSelected,
        rowIsDisabled,
        rowTree,
        withSelectionCheckbox
      } = this;

      const {
        __toggleRowExpansion,
        expandRows,
        expandSlot,
        isRowGroupSelected,
        isRowGroupSomeSelected,
        rowsGroups
      } = this.table;

      const rowGroupsAreEnabled = !!rowsGroups?.length;

      const {
        autoWidth,
        disableOverflow,
        hideCellContent,
        index: columnIndex,
        resizable,
        showOverflowTooltip,
        width
      } = this.column;

      if (rowIsGroup) {
        const {
          collapseButtonDisabled,
          collapsible: rowGroupIsCollapsible,
          toggleCollapsed: toggleGroupRow,
          currentCollapsed: rowGroupIsCollapsed
        } = rowGroup;

        if (rowGroupIsCollapsible && columnIndex === 0) {
          prefixElements.push(<el-button
            type="ghost"
            class="mr-8"
            disabled={collapseButtonDisabled}
            onClick={toggleGroupRow}>
            <el-icon
              name="i-chevron-right--16"
              class={{
                // 'el-table__row-group-header-collapse-icon': true,
                'el-table__expand-icon': true,
                'el-table__expand-icon--expanded': !rowGroupIsCollapsed
              }}
            />
          </el-button>);
        }
      }

      const showSelectionInRowGroup = (
        withSelectionCheckbox
        && rowGroupsAreEnabled
        && rowIsGroup
        && rowGroup?.rowGroupIsSelectable
      );

      const showSelectionInRowGroupItem = (
        withSelectionCheckbox
        && rowGroupsAreEnabled
        && !rowIsGroup
        && rowGroup?.rowGroupItemsAreSelectable
      );

      if (
        withSelectionCheckbox && (
          !rowGroupsAreEnabled
          || showSelectionInRowGroup
          || showSelectionInRowGroupItem
        )
      ) {
        const onWrapperClick = rowIsDisabled ? noop : this.rowSelectionChange;
        prefixElements.push(
          <el-checkbox
            title=""
            class={{
              'el-table__selection-cell-checkbox-wrapper': true,
              'is-disabled': rowIsDisabled,
              'is-group-row-selection': rowGroupsAreEnabled && !rowIsGroup
            }}
            on-click={ onWrapperClick }
            nativeOn-click={ (event) => event.stopPropagation() }
            value={ rowIsGroup ? isRowGroupSelected(rowGroup.groupId) : rowIsSelected }
            indeterminate={rowIsGroup && !!isRowGroupSomeSelected(rowGroup.groupId)}
            disabled={ rowIsDisabled }
            on-input={ () => { this.handleSelectionAction(); } }
          />
        );
      }

      if (rowTree) {
        const callback = (e) => {
          e.stopPropagation();
          this.table.loadOrToggle(row);
        };

        if (rowTree.indent) {
          prefixElements.push(
            <span
              class={{
                'el-table__indent': true,
                'el-table__indent--leaf': rowTree.isLeaf
              }} style={{ 'padding-left': `${rowTree.indent + 8}px` }}>
          </span>
          );
        }

        if (typeof rowTree.expanded === 'boolean' && !rowTree.noLazyChildren) {
          if (rowTree.loading) {
            prefixElements.push(
              <el-loading color="brand-primary" class="mr-8"></el-loading>
            );
          } else if (!rowTree.isLeaf) {
            prefixElements.push(
              <el-icon
                name="i-chevron-right--16"
                on-click={ callback }
                class={{
                  'el-table__expand-icon': true,
                  'mr-8': true,
                  'el-table__expand-icon--expanded': rowTree.expanded
                }}
              />
            );
          }
        } else {
          prefixElements.push(<span class="el-table__placeholder"></span>);
        }
      }

      // TODO use column property
      const hasExpandColumn = expandSlot && column.index === 0;
      if (hasExpandColumn) {
        const classes = ['el-table__expand-icon', 'mr-8'];
        const rowIsExpanded = expandRows.indexOf(row) > -1;
        const callback = (e) => {
          e.stopPropagation();
          __toggleRowExpansion(row);
        };
        const { customIcons } = this.table;
        const rowExpandedIcon = customIcons.expand || 'i-minus-rounded--16';
        const rowCollapsedIcon = customIcons.collapse || 'i-plus-rounded--16';
        prefixElements.push(<div class={ classes }
                     on-click={callback}>
          <el-icon name={rowIsExpanded ? rowExpandedIcon : rowCollapsedIcon}></el-icon>
        </div>);
      }

      const cellContentClass = {
        'el-table__cell_content': true,
        'el-table__expand-column': hasExpandColumn,
        'is-blank': hideCellContent,
        'el-table__disable-overflow': disableOverflow
      };

      // TODO use autoWidth wrapper separately
      return (showOverflowTooltip || autoWidth) && value
        ? (
          <span class={cellContentClass}>
            {prefixElements}
            <tooltip-wrapper
              disabled={!rowIsSelectable}
              tooltipText={value}
              resizable={resizable}>
              { cellContent }
            </tooltip-wrapper>
          </span>
        )
        : (
            <span
              class={cellContentClass}
              title={ hint && value }
            >
              {prefixElements}
              {
                width === COLUMN_ICON_WIDTH ? cellContent : (
                  <tooltip-wrapper disabled={true}>
                    { cellContent }
                  </tooltip-wrapper>
                )
              }
            </span>
        );
    },

    rowSelectionChange(event) {
      event.stopPropagation();
      this.table.toggleRowSelection(this.row);
    },

    renderCellSlot(h, data) {
      const { rowIsGroup } = this;
      const {
        renderCell, scopedSlots = {}, prop, type, slotName, name
      } = data.column;
      const {
        cell: cellSlot,
        [`cell_${prop}`]: propCellSlot,
        [`cell_${name}`]: namedCellSlot,
        [`cell_group_${prop}`]: propGroupCellSlot,
        [`cell_group_${name}`]: namedGroupCellSlot,
        actions: actionsSlot,
        [slotName]: customCellSlot
      } = this.table.$slots;
      const { default: tableColumnDefaultSlot = null } = scopedSlots;

      return typeof renderCell === 'function' && renderCell(h, data)
        || (tableColumnDefaultSlot && tableColumnDefaultSlot(data))
        || (
          type === COLUMN_TYPES.ACTIONS && (
            typeof actionsSlot === 'function'
              ? actionsSlot(data)
              : this.renderActionsSlot(h, data)
          )
        )
        || (rowIsGroup && typeof propGroupCellSlot === 'function' && propGroupCellSlot(data))
        || (rowIsGroup && typeof namedGroupCellSlot === 'function' && namedGroupCellSlot(data))
        || (typeof customCellSlot === 'function' && customCellSlot(data))
        || (typeof namedCellSlot === 'function' && namedCellSlot(data))
        || (typeof propCellSlot === 'function' && propCellSlot(data))
        || typeof cellSlot === 'function' && cellSlot(data)
        || getCellValue(data);
    },

    renderActionsSlot: (h, {
      row, isSelected, rowActions, cell
    }) => (
        <ElTableActions
          actions={rowActions}
          isSelected={isSelected}
          on-command={(rowFromEvent) => cell.handleRowAction(rowFromEvent)}
          row={row}
        />
    ),

    /**
     * Cell with type selection can be treatened as selectable if property is defined
     * @returns {Boolean|boolean}
     */
    cellIsSelectable() {
      return this.column.selectable
        ? this.rowIsSelectable
        : false;
    },

    handleRowAction({ command, item }) {
      return this.table.$emit('row-action', { command, row: item });
    },

    handleSelectionAction() {
      const {
        row,
        rowIsSelected,
        rowIsGroup,
        rowGroup
      } = this;

      if (rowIsGroup) {
        return this.table.selectRowGroup(rowGroup.groupId);
      }

      return this.table.toggleRowSelection(row, !rowIsSelected);
    }
  },
  render() {
    const {
      column,
      isStub,
      renderCellBody,
      row,
      rowGroup,
      rowIndex,
      rowIsSelectable,
      rowIsSelected,
      rowKey,
      rowTree,
      store,
      table,
      value
    } = this;

    const { expandSlot } = this.table;

    // draw empty cell (stub)
    // TODO remove stubs
    if (isStub) {
      return <el-td
        store={store}
        column={column}
        ref="cell"
      />;
    }

    // draw skeleton
    if (!(column.renderBody || renderCellBody)
      || table.cSkeleton
    ) {
      return (
        <el-td
          store={store}
          column={column}
          ref="cell"
        ><span class="el-table__cell_skeleton" /></el-td>
      );
    }

    const cellListeners = {};

    const columnIsSelectable = this.cellIsSelectable();
    if (column.type === COLUMN_TYPES.SELECTION && columnIsSelectable) {
      Object.assign(cellListeners, {
        click: ($e) => {
          if (!table.isSelectable || table.multiSelectionModeState) {
            $e.stopPropagation();
            return this.table.toggleRowSelection(row);
          }
        }
      });
    } else if (column.clickable) {
      Object.assign(cellListeners, {
        click: ($e) => {
          const focusableElements = getFocusableChildElements(this.$el);

          if (focusableElements.length > 0
            && focusableElements.includes($e.target)
          ) {
            $e.stopPropagation();
          }
        }
      });
    }

    const renderCellContent = this.renderCellSlot(h, {
      row,
      rowKey,
      column,
      cell: this,
      store,
      isDisabled: !rowIsSelectable,
      isSelected: rowIsSelected,
      rowGroup,
      rowActions: this.table.rowActions,
      $index: rowIndex
    });

    return (
            <el-td
              store={store}
              column={column}
              isDisabled={!rowIsSelectable}
              isExpandable={!!rowTree || (!!expandSlot && column.index === 0)}
              ref="cell"
              name={column.name}
              { ...{ on: cellListeners }}
            >
            {this.renderContent(
              renderCellContent,
              column.showHint,
              value
            )}
            </el-td>
    );
  }
};
