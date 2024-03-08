import { h } from 'vue';

import { debounce } from 'throttle-debounce';

import ElCheckbox from 'packages/checkbox';
import ElIcon from 'packages/icon';
import { mapStates } from 'packages/table/src/store/helper';
import { COLUMN_TYPES, COLUMN_ICON_WIDTH } from 'packages/table/src/table-constants';
import TooltipWrapper from 'packages/widgets/tooltip-wrapper';
import { hasClass, addClass, removeClass } from '@/utils/dom';

import ElTableColumnVisibility from './table-columns-visibility.vue';
import { getFocusableChildElements } from './table-utils';

const ResizeProxyHeaderShift = 6;
const ResizeProxyBodyShift = 4;
const SORT_ICON_WIDTH = 24;

export default {
  name: 'ElTableHeaderCell',
  components: {
    ElIcon,
    ElCheckbox,
    ElTableColumnVisibility,
    TooltipWrapper
  },
  props: {
    isStub: Boolean,
    cellIndex: Number,
    rowIndex: Number,
    rowCount: Number,
    column: {
      type: Object,
      required: true
    },
    sortOrder: {
      type: [String, Boolean]
    },
    store: {
      type: Object
    }
  },
  emits: ['column-resizer-mousedown'],
  computed: {
    ...mapStates({
      dataLength: 'dataLength'
    }),
    table() {
      return this.store.table;
    },
    cellClasses() {
      const {
        align,
        bordered,
        clickable,
        dragging,
        headerAlign,
        hovered,
        isFirstFixedRightColumn,
        isLastFixedColumn,
        labelClassName,
        resizable,
        sortable,
        type
      } = this.column;

      const {
        borderLeft,
        borderRight,
        dataLength,
        table,
        withSelectionCheckbox
      } = this;

      const cellAlign = headerAlign || align || null;

      return {
        'el-table__head_cell': true,
        'is-actions-column': type === COLUMN_TYPES.ACTIONS,
        'el-table__column-resize': resizable && !table.colReordering,
        'is-align-center': !cellAlign && ['bool', 'boolean', 'date', 'datetime'].indexOf(type) > -1,
        'is-align-right': !cellAlign && ['integer', 'float', 'number', 'numeric'].indexOf(type) > -1,
        'is-selection': withSelectionCheckbox,
        'is-index': type === COLUMN_TYPES.INDEX,
        'is-clickable': clickable,
        'is-sortable': sortable,
        'is-bordered': bordered,
        'is-bordered-right': borderRight || (isLastFixedColumn && table.layout.scrollX && table.scrollLeft > 0),
        'is-bordered-left': borderLeft || (isFirstFixedRightColumn && table.layout.scrollX && !table.isScrollRight),
        'is-bordered-left-hidden': isFirstFixedRightColumn && table.isScrollRight,
        'is-column-hovered': (dragging || hovered) && !table.colReordering,
        'is-resizable': resizable,
        'is-disabled': dataLength === 0 || !table.hasSelectableKeys,
        [`is-align-${cellAlign}`]: cellAlign,
        [labelClassName]: labelClassName
      };
    },
    sortClasses() {
      return {
        arrow: true,
        'ml-8': true,
        [this.sortOrder > 0 ? 'asc' : 'desc']: true
      };
    },
    cellStyles() {
      const { realWidth, width, minWidth } = this.column;
      const cellWidth = realWidth || width || minWidth;
      return {
        width: cellWidth && `${cellWidth}px`,
        minWidth: minWidth && `${minWidth}px`
      };
    },
    bordered() {
      return this.column.border;
    },
    borderLeft() {
      return this.bordered && this.column.borderPosition === 'left';
    },
    borderRight() {
      return this.bordered && this.column.borderPosition === 'right';
    },
    withSelectionCheckbox() {
      const { selectionEnabled } = this.table;
      const { type, showSelection } = this.column;

      return type === COLUMN_TYPES.SELECTION
        || (this.cellIndex === 0 && (showSelection || selectionEnabled));
    }
  },
  methods: {
    getSortIcon() {
      const { customIcons } = this.table;
      const ascSortIcon = customIcons.ascSort || 'i-arrow-sort-up--16';
      const descSortIcon = customIcons.descSort || 'i-arrow-sort-down--16';

      return this.column.order === 'ascending'
        ? ascSortIcon
        : descSortIcon;
    },

    onColumnResizerMousedown() {
      this.$emit('column-resizer-mousedown', this.column);
    },

    toggleAllSelectionOnClick(event) {
      event.stopPropagation();
      this.isSelectableToggleSelection();
    },

    isSelectableToggleSelection() {
      if (this.table.hasSelectableKeys) {
        this.table.toggleAllSelection();
      }
    },

    handleMouseDown(event) {
      if (this.$isServer) return;
      const { column } = this;

      if (column.children?.length > 0) return;
      /* istanbul ignore if */
      if (this.draggingColumn) {
        const { table } = this;
        const tableEl = table.$el;
        const tableLeft = tableEl.getBoundingClientRect().left;
        const columnEl = this.$el;
        const columnRect = columnEl.getBoundingClientRect();
        const minLeft = (columnRect.left - tableLeft)
          + (column.minWidth ? column.minWidth : 32)
          + (column.sortable ? SORT_ICON_WIDTH : 0);

        this.table.dragging = true;
        this.$parent.$parent.isBeingResized = true;
        event.target.style.cursor = 'ew-resize';
        // Vue.set(column, 'dragging', true);
        column.dragging = true;
        addClass(columnEl, 'noclick');
        this.$parent.$el.classList.add('is-rowresize');
        this.dragState = {
          startMouseLeft: event.clientX,
          startLeft: columnRect.right - tableLeft,
          startColumnLeft: columnRect.left - tableLeft,
          tableLeft
        };

        const { resizeProxyHeader, resizeProxyBody } = table.$refs;
        resizeProxyHeader.style.top = `${this.rowIndex * this.$el.offsetHeight / (this.rowCount - this.rowIndex)}px`;
        resizeProxyHeader.style.height = `${this.$el.offsetHeight - 1}px`;
        resizeProxyHeader.style.left = `${this.dragState.startLeft - ResizeProxyHeaderShift}px`;
        resizeProxyBody.style.top = `${this.rowIndex * this.$el.offsetHeight / (this.rowCount - this.rowIndex)}px`;
        resizeProxyBody.style.left = `${this.dragState.startLeft - ResizeProxyBodyShift}px`;
        table.resizeProxyVisible = {
          header: true,
          body: true
        };

        document.onselectstart = function () { return false; };
        document.ondragstart = function () { return false; };

        const handleMouseMove = (mouseEvent) => {
          const deltaLeft = mouseEvent.clientX - this.dragState.startMouseLeft;
          const proxyLeft = this.dragState.startLeft + deltaLeft;

          resizeProxyHeader.style.left = `${Math.max(minLeft, proxyLeft) - ResizeProxyHeaderShift}px`;
          resizeProxyBody.style.left = `${Math.max(minLeft, proxyLeft) - ResizeProxyBodyShift}px`;
        };

        const handleMouseUp = () => {
          if (this.table.dragging) {
            const {
              startColumnLeft,
              startLeft
            } = this.dragState;
            const finalLeft = parseInt(resizeProxyBody.style.left, 10) + ResizeProxyBodyShift;

            table.layout.updateColumnWidth(column, finalLeft - startColumnLeft);
            table.$emit('header-dragend', column.width, startLeft - startColumnLeft, column, event);

            this.table.doLayout();
            this.draggingColumn = null;
            this.dragState = {};

            table.resizeProxyVisible = {
              header: false,
              body: false
            };
          }

          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
          document.onselectstart = null;
          document.ondragstart = null;
          this.table.layout.updateColumnsWidth();
          this.table.syncFixedColumns(this.table.scrollLeft);

          setTimeout(() => {
            removeClass(columnEl, 'noclick');
            this.table.dragging = false;
            this.$parent.$el.classList.remove('is-rowresize');
            this.$parent.$parent.isBeingResized = false;
            // TODO: AUK-1577 column.dragging lose reactability when set directly
            // Vue.set(column, 'dragging', false);
            column.dragging = false;
          }, 0);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
    },

    handleMouseOver() {
      const { column } = this;

      if ((column.resizable || column.sortable) && !this.table.dragging) {
        // Vue.set(column, 'hovered', true);
        column.hovered = true;
      }
    },

    handleMouseOut(event) {
      if (this.$isServer) return;
      const { column } = this;

      // Vue.set(column, 'hovered', false);
      column.hovered = false;

      this.toggleMouseAtEdgeState(false, event.target);
    },

    handleMouseMove(event) {
      const { column } = this;

      if (column.children?.length > 0) return;
      let { target } = event;
      while (target && target.tagName !== 'TH') {
        target = target.parentNode;
      }

      if (!column || !column.resizable) return;

      if (target && !this.table.dragging) {
        const rect = target.getBoundingClientRect();

        if (rect.width > 30 && rect.right - event.pageX < 15) {
          this.toggleMouseAtEdgeState(true, target);
        } else if (!this.table.dragging) {
          this.toggleMouseAtEdgeState(false, target);
        }
      }
    },

    toggleMouseAtEdgeState(atEdge, target) {
      const bodyStyle = document.body.style;
      if (atEdge) {
        this.$parent.$parent.isBeingResized = true;
        if (!this.table.colReordering) {
          target.style.cursor = 'ew-resize';
        }
        this.draggingColumn = this.column;
      } else {
        this.$parent.$parent.isBeingResized = false;
        if (!this.table.colReordering) {
          bodyStyle.cursor = '';
          target.style.cursor = '';
        }
        this.draggingColumn = null;
      }
    },

    handleHeaderClick(event) {
      event.preventDefault();

      const { column } = this;
      let { target } = event;
      while (target && target.tagName !== 'TH') {
        target = target.parentNode;
      }
      const rect = target.getBoundingClientRect();

      // only trigger click event if not resizable && mouse is not at the header edge
      if (!(column.resizable && rect.right - event.pageX < 15) && !column.dragging) {
        if (column.clickable) {
          const focusableElements = getFocusableChildElements(event.target);
          const focusableEl = focusableElements[0];
          if (focusableElements.length === 1 && !focusableEl.contains(event.target)) {
            event.stopPropagation();
            focusableEl.click();
            return;
          }
        }

        this.table.$emit('header-click', column, event);
      }
    },

    toggleOrder(order) {
      return !order ? 'ascending' : (order === 'ascending' ? 'descending' : 'ascending');
    },

    handleSortClick(event, column) {
      event.stopPropagation();
      const order = this.toggleOrder(column.order);

      let { target } = event;
      while (target && target.tagName !== 'TH') {
        target = target.parentNode;
      }

      if (target && target.tagName === 'TH') {
        if (hasClass(target, 'noclick')) {
          removeClass(target, 'noclick');
          return;
        }
      }

      if (!column.sortable) return;

      let sortOrder;

      if (!order) {
        sortOrder = null;
      } else {
        sortOrder = order;
      }

      this.store.commit('sort', { prop: column.prop, order: sortOrder });
    },

    renderContent(content) {
      const cellContentClass = {
        'el-table__head_cell_content': true,
        'is-blank': this.column.hideCellContent
      };
      const {
        label, showHint, order, sortable
      } = this.column;
      const { column } = this;

      return (
        <span
          class={cellContentClass}
          ref="content"
          title={showHint && label ? label : false}>{content}{
            sortable && (
              <span
                class={this.sortClasses}
                on-mouseenter={() => { this.$parent.$parent.enableColDrag = true; }}
                on-mouseleave={() => { this.$parent.$parent.enableColDrag = false; }}
                on-click={(event) => this.handleSortClick(event, column)}
              >
                <el-button type="ghost" disabled={this.table.colReordering || this.table.dragging}>
                  <el-icon name={this.getSortIcon()} color={order ? 'brand-primary' : 'brand-light'}></el-icon>
                </el-button>
              </span>
            )
          }
        </span>
      );
    },

    renderHeaderSlot(data) {
      const {
        label,
        renderHeader,
        scopedSlots = {},
        prop,
        name,
        type,
        resizable,
        width,
        showOverflowTooltip
      } = data.column;
      const {
        actions_header: actionsHeaderSlot,
        cell_header: headerSlot,
        [`cell_header_${name}`]: namedHeaderSlot,
        [`cell_header_${prop}`]: propHeaderSlot
      } = this.table.$slots;
      const {
        header: tableColumnHeaderSlot = null
      } = scopedSlots;

      const body = (typeof renderHeader === 'function' && renderHeader(h, data))
        || (tableColumnHeaderSlot && <span class="el-table__head_cell_slot">{tableColumnHeaderSlot(data)}</span>)
        || (
          type === COLUMN_TYPES.ACTIONS && (
            typeof actionsHeaderSlot === 'function'
              ? actionsHeaderSlot(data)
              : this.renderVisibilitySlot(h, data)
          )
        )
        || (typeof namedHeaderSlot === 'function' && namedHeaderSlot(data))
        || (typeof propHeaderSlot === 'function' && propHeaderSlot(data))
        || (typeof headerSlot === 'function' && headerSlot(data))
        || label
        || '';

      return width === COLUMN_ICON_WIDTH ? body : (
        <tooltip-wrapper tooltipText={label} resizable={resizable} disabled={!showOverflowTooltip}>
          {body}
        </tooltip-wrapper>
      );
    },
    renderVisibilitySlot: () => (
        <ElTableColumnVisibility/>
    )
  },
  render() {
    let headerCellContent;
    const cellListeners = {};
    const { column } = this;
    const { colSpan, rowSpan, sortable } = column;

    if (this.isStub) {
      return <th
        class={this.cellClasses}
        style={this.cellStyles}
      />;
    }

    const renderHeaderContent = this.renderHeaderSlot(
      {
        column,
        owner: this.table,
        store: this.store,
        $index: this.cellIndex
      }
    );

    if (this.withSelectionCheckbox) {
      headerCellContent = [
        <div
          title=""
          class={{
            'el-table__selection-cell-checkbox-wrapper': true,
            'is-group-row-selection': this.table.rowsGroups.length
          }}
          on-click={this.toggleAllSelectionOnClick}>
          <el-checkbox
            disabled={this.dataLength === 0 || !this.table.hasSelectableKeys}
            indeterminate={this.table.selection.length > 0 && !this.table.allRowsSelected}
            on-change={this.table.toggleAllSelection}
            value={this.table.allRowsSelected}
          />
        </div>,
        renderHeaderContent
      ];
      !sortable && Object.assign(cellListeners, { click: this.isSelectableToggleSelection });
    } else {
      headerCellContent = renderHeaderContent;
    }

    return (
      <th
        on-mousemove={debounce(50, (e) => this.handleMouseMove(e))}
        on-mouseover={this.handleMouseOver}
        on-mouseout={this.handleMouseOut}
        on-mousedown={this.handleMouseDown}
        on-click={this.handleHeaderClick}
        class={this.cellClasses}
        style={this.cellStyles}
        colspan={colSpan > 1 && colSpan}
        rowspan={rowSpan > 1 && rowSpan}
        {...{ on: cellListeners }}
      >
        {
          this.renderContent(headerCellContent)
        }
        {
          column.resizable && (<span class="resize" on-mousedown={this.onColumnResizerMousedown} />)
        }
      </th>
    );
  }
};
