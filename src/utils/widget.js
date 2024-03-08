import { rgba } from '../../colors/js/utils/color-utils';

const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d);
};

export const isValidData = (arr, dataFormat = 'single') => {
  if (dataFormat === 'single') {
    let b = true;
    arr.forEach((a) => {
      if (isNaN(a)) {
        b = false;
      }
      if (!isNaN(a) && a < 0) {
        b = false;
      }
    });
    return b;
  }
  let b = true;
  arr.forEach((a) => {
    if (!a.x || !isValidDate(a.x)) {
      b = false;
    }
    if (a.y === undefined || isNaN(a.y)) {
      b = false;
    }
    if (!isNaN(a.y) && a.y < 0) {
      b = false;
    }
  });
  return b;
};

export const cleanData = (arr, precision) => {
  return arr.map((a) => {
    return Number(parseFloat(a).toFixed(precision));
  });
};

export const getDataMaxY = (arr) => {
  return Math.max(...arr);
};

export const getColors = (n, colors) => {
  let a = [];
  const quotient = Math.floor(n / colors.length);
  const remainder = n % colors.length;
  for (let i = 0; i < quotient; i++) {
    a = a.concat(colors);
  }
  a = a.concat(colors.slice(0, remainder));
  return a;
};

export const getFadedColors = (colors) => {
  const a = [];
  colors.forEach((color) => {
    a.push(rgba(color, 0.2));
  });
  return a;
};

export const getPercentageData = (arr, maxV) => {
  return [(arr[0] / maxV) * 100, ((maxV - arr[0]) / maxV) * 100];
};
