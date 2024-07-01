export const isFunction = function (value: any) {
  return Object.prototype.toString.call(value).toLowerCase() === '[object function]';
};
