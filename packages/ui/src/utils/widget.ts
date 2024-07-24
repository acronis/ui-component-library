import { rgba } from './color-utils.ts';

function isValidDate(d) {
  return d instanceof Date && !Number.isNaN(d);
}

export function isValidData(arr, dataFormat = 'single') {
  if (dataFormat === 'single') {
    let b = true;
    arr.forEach((a) => {
      if (Number.isNaN(a)) {
        b = false;
      }
      if (!Number.isNaN(a) && a < 0) {
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
    if (a.y === undefined || Number.isNaN(a.y)) {
      b = false;
    }
    if (!Number.isNaN(a.y) && a.y < 0) {
      b = false;
    }
  });
  return b;
}

export function cleanData(arr, precision) {
  return arr.map((a) => {
    return Number(Number.parseFloat(a).toFixed(precision));
  });
}

export function getDataMaxY(arr) {
  return Math.max(...arr);
}

export function getColors(n, colors) {
  let a = [];
  const quotient = Math.floor(n / colors.length);
  const remainder = n % colors.length;
  for (let i = 0; i < quotient; i++) {
    a = a.concat(colors);
  }
  a = a.concat(colors.slice(0, remainder));
  return a;
}

export function getFadedColors(colors): string[] {
  const a: string[] = [];
  colors.forEach((color) => {
    a.push(rgba(color, 0.2));
  });
  return a;
}

export function getPercentageData(arr, maxV) {
  return [(arr[0] / maxV) * 100, ((maxV - arr[0]) / maxV) * 100];
}
