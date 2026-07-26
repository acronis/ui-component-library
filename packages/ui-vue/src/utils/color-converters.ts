// https://github.com/Qix-/color-convert/blob/master/conversions.js

export function hex2rgb(hex) {
  const match = hex.toString().match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!match) {
    return [0, 0, 0];
  }

  let colorString = match[0];
  if (colorString.length === 3) {
    colorString = colorString.split('').map(char => char + char).join('');
  }

  const integer = Number.parseInt(colorString, 16);
  const r = (integer >> 16) & 0xFF;
  const g = (integer >> 8) & 0xFF;
  const b = integer & 0xFF;

  return [r, g, b];
}

export function rgb2hsl(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h;
  let s;

  if (max === min) {
    h = 0;
  }
  else if (r === max) {
    h = (g - b) / delta;
  }
  else if (g === max) {
    h = 2 + (b - r) / delta;
  }
  else if (b === max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  const l = (min + max) / 2;

  if (max === min) {
    s = 0;
  }
  else if (l <= 0.5) {
    s = delta / (max + min);
  }
  else {
    s = delta / (2 - max - min);
  }

  return [h, s * 100, l * 100];
}

export function hsl2rgb(hsl) {
  const h = hsl[0] / 360;
  const s = hsl[1] / 100;
  const l = hsl[2] / 100;
  let t2;
  let t3;
  let val;

  if (s === 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5) {
    t2 = l * (1 + s);
  }
  else {
    t2 = l + s - l * s;
  }

  const t1 = 2 * l - t2;

  const rgb = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    t3 = h + 1 / 3 * -(i - 1);
    if (t3 < 0) {
      t3++;
    }

    if (t3 > 1) {
      t3--;
    }

    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    }
    else if (2 * t3 < 1) {
      val = t2;
    }
    else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    }
    else {
      val = t1;
    }

    rgb[i] = val * 255;
  }

  return rgb;
}

export function rgb2hex(rgb) {
  const integer = ((Math.round(rgb[0]) & 0xFF) << 16)
    + ((Math.round(rgb[1]) & 0xFF) << 8)
    + (Math.round(rgb[2]) & 0xFF);

  const string = integer.toString(16).toUpperCase();
  return `#${'000000'.substring(string.length)}${string}`;
}

export const rgba2hex = rgba => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d*)?))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(Number.parseFloat(n) * 255) : Number.parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`;

export const hex2hsl = hex => rgb2hsl(hex2rgb(hex));

export const hsl2hex = hsl => rgb2hex(hsl2rgb(hsl));

/**
 * Parses CSS-definition of `rgb` color
 *
 * @param {string} color - color definition, example `rgb(0, 0, 0)` or `rgba(255, 255, 255, .5)`
 * @return {number[]}
 */
export function parseRgb(color) {
  const match = /^rgb(a)?\(\s*(\d+),\s*(\d+),\s*(\d+)(,\s*([.\d]+))?\)$/i.exec(color);
  if (!match) {
    return [0, 0, 0];
  }

  const channels = [match[2], match[3], match[4]];

  if (match[1] !== undefined && match[5] !== undefined) { // is rgba and has opacity?
    channels.push(match[6]);
  }

  return channels.map(Number);
}

export function cssValue(property) {
  const color = `--acv-${property}`;
  return window.getComputedStyle(document.documentElement).getPropertyValue(color);
}
