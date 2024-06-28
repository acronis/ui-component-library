export const isInteger = function (value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && Math.floor(value) === value;
};
