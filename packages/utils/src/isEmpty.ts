export const isEmpty = function (val: { message?: any, length?: any, size?: any } | null) {
  // null or undefined
  if (val == null) {
    return true;
  }

  if (typeof val === 'boolean') {
    return false;
  }

  if (typeof val === 'number') {
    return !val;
  }

  if (val instanceof Error) {
    return val.message === '';
  }

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
