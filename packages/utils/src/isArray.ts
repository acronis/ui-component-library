export const isArray = typeof Array.isArray === 'function'
  ? Array.isArray
  : function isArray(value: any): value is Array<any> {
    return Object.prototype.toString.call(value).toLowerCase() === '[object array]';
  };
