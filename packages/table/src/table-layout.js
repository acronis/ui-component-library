import { nextTick } from 'vue';
import {
  COLUMN_MIN_WIDTH
} from 'packages/table/src/table-constants';

import { getParentScrollableElement } from './table-utils';

class TableLayout {
  constructor(options) {
    this.table = null;
    this.flexColumns = null;
    this.fit = true;
    this.showHeader = true;

    this.height = null;
    this.scrollY = false;
    this.clientWidth = null;
    this.fixedWidth = null;
    this.rightFixedWidth = null;
    this.tableHeight = null;
    this.headerHeight = 44; // Table Header Height
    this.footerHeight = 44; // Table Footer Height
    this.viewportHeight = null; // Table Height - Scroll Bar Height
    this.bodyHeight = null; // Table Height - Table Header Height
    this.fixedBodyHeight = null; // Table Height - Table Header Height - Scroll Bar Height

    for (const name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name];
      }
    }

    if (!this.table) {
      throw new Error('table is required for Table Layout');
    }
  }

  updateScrollY() {
    const { height, bodyHeight } = this;
    if (typeof height !== 'string' && typeof height !== 'number') return;
    const { bodyWrapper, $el: tableEl } = this.table;
    if (tableEl && bodyWrapper) {
      const body = bodyWrapper.querySelector('.el-table__body') || bodyWrapper.querySelector('.el-table__scroll_list_wrapper');
      this.scrollY = body.offsetHeight > bodyHeight;
    }
  }

  setHeight(heightValue, prop = 'height') {
    let value = heightValue;
    const el = this.table.$el;

    if (typeof value === 'string' && /^\d+$/.test(value)) {
      value = Number(value);
    } else if ((value === 'fit' || value === 'fit-scrollable') && el) {
      const scrollParent = getParentScrollableElement(el, 'y');
      const scrollParentRectTop = scrollParent.getBoundingClientRect ? scrollParent.getBoundingClientRect().top : 0;
      value = scrollParent.clientHeight - (el.getBoundingClientRect().top - scrollParentRectTop);
    } else if (value === 'fit-viewport' && el) {
      const windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      value = windowHeight - el.getBoundingClientRect().top;
    }
    this.height = value;

    if (!el && (value || value === 0)) return nextTick(() => this.setHeight(value, prop));

    if (typeof value === 'number') {
      el.style[prop] = `${value}px`;

      this.updateElsHeight();
    }
  }

  setMaxHeight(value) {
    return this.setHeight(value, 'max-height');
  }

  updateElsHeight() {
    if (!this.table.$ready) return nextTick(() => this.updateElsHeight());
    const { headerWrapper, footerWrapper } = this.table.$refs;

    if (this.showHeader && !headerWrapper) return;
    const headerHeight = !this.showHeader ? 0 : headerWrapper.offsetHeight;
    this.headerHeight = headerHeight;
    if (
      this.showHeader
      && headerWrapper.offsetWidth > 0
      && (this.table.visibleColumns || []
      ).length > 0 && headerHeight < 2) {
      return nextTick(() => this.updateElsHeight());
    }
    const tableHeight = this.table.$el.clientHeight;
    this.tableHeight = tableHeight;
    if (this.height !== null && (!Number.isNaN(this.height) || typeof this.height === 'string')) {
      const footerHeight = footerWrapper ? footerWrapper.offsetHeight : 0;

      this.footerHeight = footerHeight;
      this.bodyHeight = ((tableHeight - headerHeight) - footerHeight) + (footerWrapper ? 1 : 0);
    }
    this.fixedBodyHeight = this.bodyHeight;

    this.viewportHeight = tableHeight;

    this.updateScrollY();
  }

  // TODO put here all logic with column width, minWidth and maxWidth
  // TODO remove
  // updateColumnWidth(column, width) {
  //   // let newWidth;
  //   // if (this.table.visibleColumns.length === 1) {
  //   //   // TODO set to bodyWidth?
  //   //   newWidth = 'auto';
  //   // } else {
  //   //   newWidth = width < COLUMN_MIN_WIDTH ? COLUMN_MIN_WIDTH : width;
  //   // }
  //
  //   // column.realWidth = newWidth;
  //   this.updateColumnsWidth();
  //   this.table.updateColumnState({ column });
  // }

  getColumnWidth(columnWidth, columnIndex) {
    const { visibleColumns, bodyWidth = undefined, clientWidth = undefined } = this.table;

    if (
      (clientWidth >= bodyWidth && columnIndex + 1 === visibleColumns.length)
      || visibleColumns.length === 1
    ) {
      return undefined;
    }
    return columnWidth;
  }

  getBodyMinWidth(flattenColumns, resizableFlag) {
    let bodyMinimumWidth = 0;
    flattenColumns.forEach((column) => {
      let flexWidth = 0;
      const minWidth = column.minWidth || COLUMN_MIN_WIDTH;

      if (!resizableFlag || (resizableFlag && !column.resizable)) {
        flexWidth = column.width || column.minWidth || COLUMN_MIN_WIDTH;
      } else if (column.resizable) {
        flexWidth = column.minWidth || COLUMN_MIN_WIDTH;
      }

      if (flexWidth < minWidth) {
        flexWidth = minWidth;
      }
      column.realWidth = flexWidth;
      column.minWidth = minWidth;

      bodyMinimumWidth += flexWidth;
    });
    return bodyMinimumWidth;
  }
}

export default TableLayout;
