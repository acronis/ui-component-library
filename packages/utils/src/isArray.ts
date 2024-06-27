export const isArray = function (value: any) {
  return typeof Array.isArray === 'function'
    ? Array.isArray(value)
    : Array.isArray(value);
};
