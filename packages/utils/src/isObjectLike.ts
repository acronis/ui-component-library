import { isArray } from './isArray.ts';

export const isObjectLike = function (value: any) {
  return Object.prototype.toString.call(value).toLowerCase() === '[object object]' || isArray(value);
};
