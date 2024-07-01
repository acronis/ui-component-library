const hasOwnProperty = Object.prototype.hasOwnProperty; // eslint-disable-line prefer-destructuring

export function hasOwn(obj: any, key: PropertyKey) {
  return hasOwnProperty.call(obj, key);
}
