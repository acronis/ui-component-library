import { getValueByPath } from '@/utils/util';
import { hasClass, getScrollParent } from '@/utils/dom';

export const noop = () => {};

export const getCell = function (event) {
  let cell = event.target;

  while (cell && cell.tagName.toUpperCase() !== 'HTML') {
    if (hasClass(cell, 'el-table__cell')) {
      return cell;
    }
    cell = cell.parentNode;
  }

  return null;
};

const isObject = function (obj) {
  return obj !== null && typeof obj === 'object';
};

export const getAllColumns = (columns) => {
  const result = [];
  columns.forEach((column) => {
    if (!column.hidden) {
      if (column.children) {
        result.push(column);
        result.push(...getAllColumns(column.children));
      } else {
        result.push(column);
      }
    }
  });
  return result;
};

export const orderBy = function (array, sortKey, reverseOrder, sortMethod, sortProp) {
  let reverse = reverseOrder;
  let sortBy = sortProp;

  if (!sortKey && !sortMethod && (!sortBy || Array.isArray(sortBy) && !sortBy.length)) {
    return array;
  }
  if (typeof reverse === 'string') {
    reverse = reverse === 'descending' ? -1 : 1;
  } else {
    reverse = (reverse && reverse < 0) ? -1 : 1;
  }
  const getKey = sortMethod ? null : function (val, index) {
    let value = val;

    if (sortBy) {
      if (!Array.isArray(sortBy)) {
        sortBy = [sortBy];
      }
      return sortBy.map(function (by) {
        if (typeof by === 'string') {
          return getValueByPath(value, by);
        }
        return by(value, index, array);
      });
    }
    if (sortKey !== '$key') {
      if (isObject(value) && '$value' in value) value = value.$value;
    }
    return [isObject(value) ? getValueByPath(value, sortKey) : value];
  };
  const compare = function (a, b) {
    if (sortMethod) {
      return sortMethod(a.value, b.value, reverseOrder);
    }
    for (let i = 0, len = a.key.length; i < len; i++) {
      let result = 0;
      const isAEmpty = a.key[i] === null || a.key[i] === undefined;
      const isBEmpty = b.key[i] === null || b.key[i] === undefined;
      const isANumber = typeof a.key[i] === 'number';
      const isBNumber = typeof b.key[i] === 'number';

      if (isAEmpty || isBEmpty) {
        result = !isAEmpty ? -1 : 1;
        if (isAEmpty && isBEmpty) result = 0;
      } else if (isANumber || isBNumber) {
        result = isANumber ? -1 : 1;
        if (isANumber && isBNumber) result = a.key[i] - b.key[i];
      } else {
        result = a.key[i].toString().localeCompare(b.key[i].toString());
      }
      if (result !== 0) return result;
    }
    return 0;
  };
  return array.map(function (value, index) {
    return {
      value: value,
      index: index,
      key: getKey ? getKey(value, index) : null
    };
  }).sort(function (a, b) {
    const order = compare(a, b);
    // Removing stable sort implementation | AUK-1619 | The same values in column should not be sorted
    return order * reverse;
  }).map((item) => item.value);
};

export const getRowIdentity = (row, rowKey = 'id') => {
  if (!row) throw new Error('row is required when get row identity');
  let identity;

  if (typeof rowKey === 'string') {
    if (rowKey.indexOf('.') < 0) {
      identity = row[rowKey];
    } else {
      const key = rowKey.split('.');
      let current = row;
      for (let i = 0; i < key.length; i++) {
        current = current[key[i]];
      }
      identity = current;
    }
  } else if (typeof rowKey === 'function') {
    identity = rowKey.call(null, row);
  }

  return (identity === 0 || identity) ? identity.toString() : undefined;
};

export const getFocusableChildElements = (el) => {
  const selector = 'i, a, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), .el-input__wrapper';
  return Array.prototype.slice.call(el.querySelectorAll(selector)).filter((elm) => elm.offsetParent);
};

export const getParentScrollableElement = (el) => {
  const scrollParent = getScrollParent(el);
  return scrollParent === window ? window.document.body : scrollParent;
};

export const getColumnByKey = ({ columns, columnValue, columnProp = 'columnKey' }) => {
  let column = null;
  for (let i = 0; i < columns.length; i++) {
    const item = columns[i];

    if (item[columnProp] === columnValue) {
      column = item;
      break;
    }
  }
  return column;
};

// todo check classname match columnKey, use data-attribute
export const getColumnByCell = function (columns, cell) {
  const matches = (cell.className || '').match(/el-table_\d+[^\s]+/gm);
  if (matches) {
    return getColumnByKey({ columns, columnValue: matches[0], columnProp: 'id' });
  }

  return null;
};

export function toggleRowStatus(statusArr, row, newVal) {
  let changed = false;
  const index = statusArr.indexOf(row);
  const included = index !== -1;

  const addRow = () => {
    statusArr.push(row);
    changed = true;
  };
  const removeRow = () => {
    statusArr.splice(index, 1);
    changed = true;
  };

  if (typeof newVal === 'boolean') {
    if (newVal && !included) {
      addRow();
    } else if (!newVal && included) {
      removeRow();
    }
  } else if (included) {
    removeRow();
  } else {
    addRow();
  }
  return changed;
}

export function getKeysMap(array, rowKey) {
  const arrayMap = {};
  (array || []).forEach((row, index) => {
    const rowIdentity = getRowIdentity(row, rowKey);
    if (rowIdentity || rowIdentity === 0) {
      arrayMap[rowIdentity] = { row, id: rowIdentity, index };
    }
  });
  return arrayMap;
}

export const sortData = ({ data, sortingColumn, sortProp, sortOrder }) => {
  if (!sortingColumn) {
    return orderBy(data, sortProp, sortOrder);
  }
  if (typeof sortingColumn.sortable === 'string') {
    return data;
  }
  return orderBy(data, sortProp, sortOrder, sortingColumn.sortMethod, sortingColumn.sortBy);
};

export const doFlattenColumns = (columns, boundsMark) => {
  const result = [];
  const columnsCount = columns.length;

  columns.forEach((column, key) => {
    if (boundsMark) {
      column[`isFirst${boundsMark}`] = key === 0;
      column[`isLast${boundsMark}`] = Object.is(columnsCount - 1, key);
    }

    if (column.children) {
      result.push.apply(result, doFlattenColumns(column.children, boundsMark));
    } else {
      result.push(column);
    }
  });
  return result;
};

// TODO move styles to the column config
export const getColumnOffsetStyles = (columns, columnIndex) => {
  const column = columns[columnIndex];
  if (!column || !column.fixed) {
    return undefined;
  }

  const fixedPosition = column.fixed === 'right' ? 'right' : 'left';

  let offset;
  const reduceFunctor = (fixed) => (resultOffset, col) => resultOffset + (
    fixed.includes(col.fixed)
      ? (col.realWidth || col.width)
      : 0
  );

  if (fixedPosition === 'right') {
    offset = columns.slice(columnIndex + 1)
      .reduce(reduceFunctor(['right']), 0);
  }
  if (fixedPosition === 'left') {
    offset = columns.slice(0, columnIndex)
      .reduce(reduceFunctor([true, 'left']), 0);
  }

  return {
    [fixedPosition]: `${offset}px`
  };
};

export function walkTreeNode(root, cb, childrenKey = 'children', lazyKey = 'hasChildren') {
  const isNil = (array) => !(Array.isArray(array) && array.length);

  function _walker(parent, children, level) {
    cb(parent, children, level);
    children.forEach((item) => {
      if (item[lazyKey]) {
        cb(item, null, level + 1);
        return;
      }
      const child = item[childrenKey];
      if (!isNil(child)) {
        _walker(item, child, level + 1);
      }
    });
  }

  root.forEach((item) => {
    if (item[lazyKey]) {
      cb(item, null, 0);
      return;
    }
    const children = item[childrenKey];
    if (!isNil(children)) {
      _walker(item, children, 0);
    }
  });
}

export const flatTree = (root, key = 'children') => {
  let result = [];
  for (const prop in root) {
    if (Object.prototype.hasOwnProperty.call(root, prop)) {
      const obj = root[prop];
      const clone = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
      delete clone[key];
      result.push(clone);

      if (obj[key]) {
        const tmp = flatTree(obj[key], key);
        result = result.concat(tmp);
      }
    }
  }
  return result;
};

function getDefaultBackground() {
  // have to add to the document in order to use getComputedStyle
  const div = document.createElement('div');
  document.head.appendChild(div);
  const bg = window.getComputedStyle(div).backgroundColor;
  document.head.removeChild(div);
  return bg;
}

export function getInheritedBackgroundColor(el) {
  // get default style for current browser
  const defaultStyle = getDefaultBackground(); // typically "rgba(0, 0, 0, 0)"

  // get computed color for el
  const backgroundColor = window.getComputedStyle(el).backgroundColor;

  // if we got a real value, return it
  if (backgroundColor !== defaultStyle) return backgroundColor;

  // if we've reached the top parent el without getting an explicit color, return default
  if (!el.parentElement) return defaultStyle;

  // otherwise, recurse and try again on parent element
  return getInheritedBackgroundColor(el.parentElement);
}

export function RGBToHSL(rgb) {
  const ex = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d.]+%?\))$/;
  if (ex.test(rgb)) {
    const sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    let splittedRgb = rgb.substring(4)
      .split(')')[0].split(sep);
    // convert %s to 0–255
    splittedRgb = splittedRgb.map((element) => {
      if (element.indexOf('%') > -1) {
        return Math.round(element.substring(0, element.length - 1) / 100 * 255);
      }
      return element;
    });

    // make r, g, and b fractions of 1
    const r = splittedRgb[0] / 255;
    const g = splittedRgb[1] / 255;
    const b = splittedRgb[2] / 255;

    // find greatest and smallest channel values
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    let h;
    let s;
    let l;

    // calculate hue
    // no difference
    if (delta === 0) {
      h = 0;
    } else if (cmax === r) { // red is max
      h = ((g - b) / delta) % 6;
    } else if (cmax === g) { // green is max
      h = (b - r) / delta + 2;
    } else { // blue is max
      h = (r - g) / delta + 4;
    }

    h = Math.round(h * 60);

    // make negative hues positive behind 360°
    if (h < 0) h += 360;

    // calculate lightness
    l = (cmax + cmin) / 2;

    // calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // multiply l and s by 100
    s = Math.round(+(s * 100).toFixed(1));
    l = Math.round(+(l * 100).toFixed(1));

    return { hsl: `hsl(${h},${s}%,${l}%)`, h, s, l };
  }

  return { hsl: 'Invalid input color' };
}
