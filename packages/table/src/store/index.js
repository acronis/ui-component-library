import { nextTick } from 'vue';

import mutations from './mutations';
import Watcher from './watcher';

Watcher.mutations = mutations;

Watcher.commit = function (name, ...args) {
  if (this.mutations[name]) {
    this.mutations[name].apply(this, [this.states].concat(args));
  } else {
    throw new Error(`Action not found: ${name}`);
  }
};

Watcher.updateTableScrollY = function () {
  nextTick(this.table?.updateScrollY);
};

Watcher.scrollIntoCurrentRow = function (rowIndex = 0) {
  const container = this.table?.$refs?.bodyScrollbar?.$refs?.wrap;
  if (container) {
    const viewRectTop = container.scrollTop;
    const viewRectBottom = viewRectTop + container.clientHeight;

    const rowHeight = this.table.rowHeight;
    const top = rowIndex * rowHeight;
    const bottom = (rowIndex + 1) * rowHeight;

    if (top < viewRectTop) {
      container.scrollTop = top;
    } else if (bottom > viewRectBottom) {
      container.scrollTop = bottom - container.clientHeight;
    }
  }
};

export default Watcher;
