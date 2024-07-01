/**
 * Coerce truthy value to array
 */
export const coerceTruthyValueToArray = function (val: any) {
  if (Array.isArray(val)) {
    return val;
  }
  if (val) {
    return [val];
  }
  return [];
};
