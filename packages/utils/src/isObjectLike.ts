import { isArray } from './isArray.ts';

const isObject = function (value: any): value is object {
  return value !== null && Object.prototype.toString.call(value).toLowerCase() === '[object object]';
};

export const isObjectLike = function (value: any): value is object | Array<any> {
  return isObject(value) || isArray(value);
};
