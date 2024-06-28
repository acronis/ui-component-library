import { isObjectLike } from './isObjectLike.ts';
import { isArray } from './isArray.ts';

export const isEqual = function (a: string | any[], b: any[]) {
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
    Object.keys(a).forEach((key: string) => {
      if (isObjectLike(a[key as keyof typeof a]) && isObjectLike(b[key as keyof typeof b])) {
        if (!isEqual(a[key as keyof typeof a], b[key as keyof typeof b])) {
          pairFound = false;
        }
      }
      else if (a[key as keyof typeof a] !== b[key as keyof typeof b]) {
        pairFound = false;
      }
    });
    return pairFound;
  }
};
