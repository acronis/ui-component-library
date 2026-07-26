const hasOwnProperty = Object.prototype.hasOwnProperty; // eslint-disable-line prefer-destructuring

export function noop() {}

export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function extend(to, _from) {
  for (const key in _from) {
    to[key] = _from[key];
  }
  return to;
}

export function toObject(arr) {
  const res = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res;
}

export const getValueByPath = function (object, prop) {
  prop = prop || '';
  const paths = prop.split('.');
  let current = object;
  let result = null;
  for (let i = 0, j = paths.length; i < j; i++) {
    const path = paths[i];
    if (!current)
      break;

    if (i === j - 1) {
      result = current[path];
      break;
    }
    current = current[path];
  }
  return result;
};

export function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');

  const keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict)
      break;
    const key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    }
    else {
      if (strict) {
        throw new Error('please transfer a valid prop path to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  };
}

export const generateId = function () {
  return Math.floor(Math.random() * 10000);
};

export const isInteger = function (value) {
  return typeof value === 'number' && Number.isFinite(value) && Math.floor(value) === value;
};

export const isArray = typeof Array.isArray === 'function'
  ? Array.isArray
  : function isArray(value: any): value is Array<any> {
    return Object.prototype.toString.call(value).toLowerCase() === '[object array]';
  };

export const isObject = function (value: any): value is object {
  return value !== null && Object.prototype.toString.call(value).toLowerCase() === '[object object]';
};

export const isObjectLike = function (value: any): value is object | Array<any> {
  return isObject(value) || isArray(value);
};

export const isFunction = function (value) {
  return Object.prototype.toString.call(value).toLowerCase() === '[object function]';
};

export const isEqual = function (a, b) {
  if (a === b) {
    return true;
  }

  if (typeof a !== typeof b || Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
    return false;
  }

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      if (isObjectLike(a[i])) {
        let pairFound = false;
        b.forEach((it) => {
          if (isEqual(a[i], it)) {
            pairFound = true;
          }
        });
        if (!pairFound) {
          return false;
        }
      }
      else if (!b.includes(a[i])) {
        return false;
      }
    }
    return true;
  }

  if (isObjectLike(a)) {
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }

    let pairFound = true;
    Object.keys(a).forEach((key) => {
      if (isObjectLike(a[key]) && isObjectLike(b[key])) {
        if (!isEqual(a[key], b[key])) {
          pairFound = false;
        }
      }
      else if (a[key] !== b[key]) {
        pairFound = false;
      }
    });
    return pairFound;
  }
};

export const isEmpty = function (val) {
  // null or undefined
  if (val == null)
    return true;

  if (typeof val === 'boolean')
    return false;

  if (typeof val === 'number')
    return !val;

  if (val instanceof Error)
    return val.message === '';

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case '[object String]':
    case '[object Array]':
      return !val.length;

    // Map or Set or File
    case '[object File]':
    case '[object Map]':
    case '[object Set]': {
      return !val.size;
    }
    // Plain Object
    case '[object Object]': {
      return !Object.keys(val).length;
    }
    default:
  }

  return false;
};

// coerce truthy value to array
export const coerceTruthyValueToArray = function (val) {
  if (Array.isArray(val)) {
    return val;
  }
  if (val) {
    return [val];
  }
  return [];
};
