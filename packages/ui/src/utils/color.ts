import type {
  Color,
  ColorMeta,
  ColorType,
  HSL,
  HSLColor,
  HSV,
  HSVColor,
  ObjectColor,
  RGB,
  RGBAColor,
  RGBColor
} from 'src/types/color.types.ts';
import { isDefined } from './common.ts';

export const BRAND_COLORS = {
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  inverted: 'inverted'
};
export type ColorBrand = typeof BRAND_COLORS[keyof typeof BRAND_COLORS];

export const STATUS_COLORS = {
  neutral: 'neutral',
  info: 'info',
  success: 'success',
  warning: 'warning',
  critical: 'critical',
  danger: 'danger',
};

export const STATE_COLORS = {
  accent: 'accent',
  active: 'active',
  disabled: 'disabled',
  focus: 'focus',
  highlight: 'highlight',
  hover: 'hover',
};

// const SURFACE_COLORS = {
//   'surface': 'surface',
//   'background': 'background',
//   'onSurface': 'onSurface',
//   'onBackground': 'onBackground',
//   'inversed': 'inversed',
//   'inversed-primary': 'inversed',
//   'inversed-secondary': 'inversed-secondary',
//   'nav-primary': 'nav-primary',
//   'nav-secondary': 'nav-secondary',
// };

export const NAMED_COLORS = Object.freeze({
  'white': 'white',
  'black': 'black',
  'transparent': 'transparent',
  'red': 'red',
  'pink': 'pink',
  'purple': 'purple',
  'deep-purple': 'deep-purple',
  'indigo': 'indigo',
  'blue': 'blue',
  'dodge-blue': 'dodge-blue',
  'light-blue': 'light-blue',
  'cyan': 'cyan',
  'teal': 'teal',
  'green': 'green',
  'light-green': 'light-green',
  'lime': 'lime',
  'yellow': 'yellow',
  'amber': 'amber',
  'orange': 'orange',
  'deep-orange': 'deep-orange',
  'brown': 'brown',
  'gray': 'gray',
  'blue-gray': 'blue-gray'
});

export const HTML_COLORS = {
  black: '#000',
  navy: '#000080',
  darkblue: '#00008b',
  mediumblue: '#0000cd',
  darkgreen: '#006400',
  green: '#008000',
  teal: '#008080',
  darkcyan: '#008b8b',
  deepskyblue: '#00bfff',
  darkturquoise: '#00ced1',
  blue: '#00f',
  mediumspringgreen: '#00fa9a',
  springgreen: '#00ff7f',
  lime: '#0f0',
  aqua: '#0ff',
  cyan: '#0ff',
  midnightblue: '#191970',
  dodgerblue: '#1e90ff',
  lightseagreen: '#20b2aa',
  forestgreen: '#228b22',
  seagreen: '#2e8b57',
  darkslategray: '#2f4f4f',
  limegreen: '#32cd32',
  mediumseagreen: '#3cb371',
  turquoise: '#40e0d0',
  royalblue: '#4169e1',
  steelblue: '#4682b4',
  darkslateblue: '#483d8b',
  mediumturquoise: '#48d1cc',
  indigo: '#4b0082',
  darkolivegreen: '#556b2f',
  cadetblue: '#5f9ea0',
  cornflowerblue: '#6495ed',
  rebeccapurple: '#663399',
  mediumaquamarine: '#66cdaa',
  dimgray: '#696969',
  slateblue: '#6a5acd',
  olivedrab: '#6b8e23',
  slategray: '#708090',
  lightslategray: '#789',
  mediumslateblue: '#7b68ee',
  lawngreen: '#7cfc00',
  chartreuse: '#7fff00',
  aquamarine: '#7fffd4',
  maroon: '#800000',
  purple: '#800080',
  olive: '#808000',
  gray: '#808080',
  skyblue: '#87ceeb',
  lightskyblue: '#87cefa',
  blueviolet: '#8a2be2',
  darkred: '#8b0000',
  darkmagenta: '#8b008b',
  saddlebrown: '#8b4513',
  darkseagreen: '#8fbc8f',
  lightgreen: '#90ee90',
  mediumpurple: '#9370db',
  darkviolet: '#9400d3',
  palegreen: '#98fb98',
  darkorchid: '#9932cc',
  yellowgreen: '#9acd32',
  sienna: '#a0522d',
  brown: '#a52a2a',
  darkgray: '#a9a9a9',
  lightblue: '#add8e6',
  greenyellow: '#adff2f',
  paleturquoise: '#afeeee',
  lightsteelblue: '#b0c4de',
  powderblue: '#b0e0e6',
  firebrick: '#b22222',
  darkgoldenrod: '#b8860b',
  mediumorchid: '#ba55d3',
  rosybrown: '#bc8f8f',
  darkkhaki: '#bdb76b',
  silver: '#c0c0c0',
  mediumvioletred: '#c71585',
  indianred: '#cd5c5c',
  peru: '#cd853f',
  chocolate: '#d2691e',
  tan: '#d2b48c',
  lightgray: '#d3d3d3',
  thistle: '#d8bfd8',
  orchid: '#da70d6',
  goldenrod: '#daa520',
  palevioletred: '#db7093',
  crimson: '#dc143c',
  gainsboro: '#dcdcdc',
  plum: '#dda0dd',
  burlywood: '#deb887',
  lightcyan: '#e0ffff',
  lavender: '#e6e6fa',
  darksalmon: '#e9967a',
  burntsienna: '#ea7e5d',
  violet: '#ee82ee',
  palegoldenrod: '#eee8aa',
  red: '#f00',
  lightcoral: '#f08080',
  khaki: '#f0e68c',
  fuchsia: '#f0f',
  magenta: '#f0f',
  aliceblue: '#f0f8ff',
  honeydew: '#f0fff0',
  azure: '#f0ffff',
  sandybrown: '#f4a460',
  wheat: '#f5deb3',
  beige: '#f5f5dc',
  whitesmoke: '#f5f5f5',
  mintcream: '#f5fffa',
  ghostwhite: '#f8f8ff',
  salmon: '#fa8072',
  antiquewhite: '#faebd7',
  linen: '#faf0e6',
  lightgoldenrodyellow: '#fafad2',
  oldlace: '#fdf5e6',
  yellow: '#ff0',
  deeppink: '#ff1493',
  orangered: '#ff4500',
  tomato: '#ff6347',
  hotpink: '#ff69b4',
  coral: '#ff7f50',
  darkorange: '#ff8c00',
  lightsalmon: '#ffa07a',
  orange: '#ffa500',
  lightpink: '#ffb6c1',
  pink: '#ffc0cb',
  gold: '#ffd700',
  peachpuff: '#ffdab9',
  navajowhite: '#ffdead',
  moccasin: '#ffe4b5',
  bisque: '#ffe4c4',
  mistyrose: '#ffe4e1',
  blanchedalmond: '#ffebcd',
  papayawhip: '#ffefd5',
  white: '#fff',
  lavenderblush: '#fff0f5',
  seashell: '#fff5ee',
  cornsilk: '#fff8dc',
  lemonchiffon: '#fffacd',
  floralwhite: '#fffaf0',
  snow: '#fffafa',
  lightyellow: '#ffffe0',
  ivory: '#fffff0',
  transparent: 'transparent',
};

export type ColorName = keyof typeof NAMED_COLORS;

export type ColorStatus = typeof STATUS_COLORS[keyof typeof STATUS_COLORS];

export type ColorState = typeof STATE_COLORS[keyof typeof STATE_COLORS];

/**
 * Base colors
 * Color that is used as a base color for the theme
 * all base color can be redefined in theme
 */
export const BASE_COLORS = {
  ...BRAND_COLORS,
  ...STATUS_COLORS,
  // ...STATE_COLORS,
  ...NAMED_COLORS
};

const INTEGER_REG = '[-+]?\\d+%?';
const NUMBER_REG = '[-+]?\\d*\\.\\d+%?';
const NUMBER_UNIT = `${NUMBER_REG},${INTEGER_REG}`;
const COLOR_REG_3 = `[\\s(]+${NUMBER_UNIT}[,\\s]+${NUMBER_UNIT}[,\\s]+${NUMBER_UNIT}\\s*\\)?`;
const COLOR_REG_4 = `[\\s(]+${NUMBER_UNIT}[,\\s]+${NUMBER_UNIT}[,\\s]+${NUMBER_UNIT}[,\\s]+${NUMBER_UNIT}\\s*\\)?`;

export const RGB_REG = new RegExp(`rgb${COLOR_REG_3}`);
export const RGBA_REG = new RegExp(`rgba${COLOR_REG_4}`);
export const HSL_REG = new RegExp(`hsl${COLOR_REG_4}`);
export const HSLA_REG = new RegExp(`hsla${COLOR_REG_4}`);
export const HSV_REG = new RegExp(`hsv${COLOR_REG_4}`);
export const HSVA_REG = new RegExp(`hsva${COLOR_REG_4}`);
export const HEX_REG_3 = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i;
export const HEX_REG_4 = /^#?([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])$/i;
export const HEX_REG_6 = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
export const HEX_REG_8 = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

// const UNIT_REG = new RegExp(NUMBER_UNIT)

// const FORMAT_REG = /^((((?:rgb)|(?:hsl)|(?:hsv))a?)|hex[3468]?|name)$/

export const COLOR_NAMES = Object.freeze(new Set(Object.keys(NAMED_COLORS))) as Readonly<
  Set<ColorName>
>;

/**
 * Determine whether the given string is a legal color value
 *
 * @param value original string
 *
 * @returns whether it is a legal color
 */
export function isColor(value: string): boolean {
  value = String(value).trim().toLowerCase();

  if (!value) {
    return false;
  }

  if (value === 'transparent' || NAMED_COLORS[value as ColorName]) {
    return true;
  }

  return (
    value === 'transparent'
    || COLOR_NAMES.has(value as ColorName)
    || RGB_REG.test(value)
    || RGBA_REG.test(value)
    || HSL_REG.test(value)
    || HSLA_REG.test(value)
    || HSV_REG.test(value)
    || HSVA_REG.test(value)
    || HEX_REG_3.test(value)
    || HEX_REG_4.test(value)
    || HEX_REG_6.test(value)
    || HEX_REG_8.test(value)
  );
}

/**
 * Convert the given string into {@link ObjectColor}, return null if the conversion cannot be performed
 *
 * @param color original color string
 *
 * @returns parsed color object
 */
export function parseStringColor(color: string): ObjectColor | null {
  color = color.toString().trim().toLowerCase();

  if (color === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0, format: 'name', toString: toRgbString };
  }

  let named = false;

  if (NAMED_COLORS[color as ColorName]) {
    color = NAMED_COLORS[color as ColorName];
    named = true;
  }

  let match;

  match = RGB_REG.exec(color);
  if (match) {
    const { r, g, b } = normalizeRgb(match[1], match[2], match[3]);

    return {
      r: r * 255,
      g: g * 255,
      b: b * 255,
      format: 'rgb',
      toString: toRgbString
    };
  }

  match = RGBA_REG.exec(color);
  if (match) {
    const { r, g, b } = normalizeRgb(match[1], match[2], match[3]);

    return {
      r: r * 255,
      g: g * 255,
      b: b * 255,
      a: normalizeAlpha(match[4]),
      format: 'rgba',
      toString: toRgbString
    };
  }

  match = HSL_REG.exec(color);
  if (match) {
    const { h, s, l } = normalizeHsl(match[0], match[1], match[3]);

    return { h: h * 360, s, l, format: 'hsl', toString: toHslString };
  }

  match = HSLA_REG.exec(color);
  if (match) {
    const { h, s, l } = normalizeHsl(match[0], match[1], match[3]);

    return {
      h: h * 360,
      s,
      l,
      a: normalizeAlpha(match[4]),
      format: 'hsla',
      toString: toHslString
    };
  }

  match = HSV_REG.exec(color);
  if (match) {
    const { h, s, v } = normalizeHsv(match[0], match[1], match[3]);

    return { h: h * 360, s, v, format: 'hsv', toString: toHsvString };
  }

  match = HSVA_REG.exec(color);
  if (match) {
    const { h, s, v } = normalizeHsv(match[0], match[1], match[3]);

    return {
      h: h * 360,
      s,
      v,
      a: normalizeAlpha(match[4]),
      format: 'hsva',
      toString: toHsvString
    };
  }

  match = HEX_REG_3.exec(color);
  if (match) {
    return {
      r: Number.parseInt(`${match[1]}${match[1]}`, 16),
      g: Number.parseInt(`${match[2]}${match[2]}`, 16),
      b: Number.parseInt(`${match[3]}${match[3]}`, 16),
      format: named ? 'name' : 'hex3',
      toString: toRgbString
    };
  }

  match = HEX_REG_4.exec(color);
  if (match) {
    return {
      r: Number.parseInt(`${match[1]}${match[1]}`, 16),
      g: Number.parseInt(`${match[2]}${match[2]}`, 16),
      b: Number.parseInt(`${match[3]}${match[3]}`, 16),
      a: convertHexToDecimal(`${match[4]}${match[4]}`),
      format: named ? 'name' : 'hex4',
      toString: toRgbString
    };
  }

  match = HEX_REG_6.exec(color);
  if (match) {
    return {
      r: Number.parseInt(match[1], 16),
      g: Number.parseInt(match[2], 16),
      b: Number.parseInt(match[3], 16),
      format: named ? 'name' : 'hex6',
      toString: toRgbString
    };
  }

  match = HEX_REG_8.exec(color);
  if (match) {
    return {
      r: Number.parseInt(match[1], 16),
      g: Number.parseInt(match[2], 16),
      b: Number.parseInt(match[3], 16),
      a: convertHexToDecimal(match[4]),
      format: named ? 'name' : 'hex8',
      toString: toRgbString
    };
  }

  return null;
}

/**
 * Parse the given {@link Color} into {@link ColorMeta}
 *
 * @param color original color value
 *
 * @returns parsed color metadata
 */
export function parseColor(color: Color): ColorMeta {
  const { a, ...rgb } = parseColorToRgba(color);

  delete rgb.format;

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

  const hex8 = rgbaToHex(rgb.r, rgb.g, rgb.b, a);

  return {
    rgb: rgb as RGBColor,
    hsl,
    hsv,
    hex,
    alpha: a,
    rgba: { ...rgb, a, format: 'rgba' },
    hsla: { ...hsl, a, format: 'hsla' },
    hsva: { ...hsv, a, format: 'hsva' },
    hex8,
    gray: rgbToGrayScale(rgb),
    origin: color
  };
}

/**
 * Parse the given {@link Color} into {@link RGBAColor}
 *
 * @param originColor original color value
 *
 * @returns parsed RGB color object
 */
export function parseColorToRgba(originColor: Color): RGBAColor {
  let rgb: RGBColor = { r: 0, g: 0, b: 0 };
  let a = 1;
  let color: Color | null;

  if (typeof originColor === 'string') {
    color = parseStringColor(originColor);
  }
  else {
    color = originColor;
  }

  if (color !== null && typeof color === 'object') {
    if ('l' in color) {
      rgb = hslToRgb(color.h, color.s, color.l);
    }
    else if ('v' in color) {
      rgb = hsvToRgb(color.h, color.s, color.v);
    }

    if ('a' in color) {
      a = normalizeAlpha(color.a ?? 1);

      if (Number.isNaN(a)) {
        a = 1;
      }
    }

    rgb = color as RGBColor;
  }

  return { ...rgb, a, format: 'rgba', toString: toRgbString };
}

/**
 * Normalize the original h, s, l values to values from 0 ~ 1
 *
 * @param h 0 ~ 360
 * @param s 0 ~ 1, 0% ~ 100%
 * @param l 0 ~ 1, 0% ~ 100%
 *
 * @returns standardized HSL object
 */
export function normalizeHsl(h: number | string, s: number | string, l: number | string) {
  return {
    h: boundRange(h, 0, 360) / 360,
    s: boundRange(isPercentage(s) ? parsePercentage(s) : s, 0, 1),
    l: boundRange(isPercentage(l) ? parsePercentage(l) : l, 0, 1)
  };
}

/**
 * Standardize the original r, g, b values to values from 0 ~ 1
 *
 * @param r 0 ~ 255
 * @param g 0 ~ 255
 * @param b 0 ~ 255
 *
 * @returns normalized RGB object
 */
export function normalizeRgb(r: number | string, g: number | string, b: number | string) {
  return {
    r: boundRange(r, 0, 255) / 255,
    g: boundRange(g, 0, 255) / 255,
    b: boundRange(b, 0, 255) / 255
  };
}

/**
 * Normalize the original h, s, v values to values from 0 ~ 1
 *
 * @param h 0 ~ 360
 * @param s 0 ~ 1, 0% ~ 100%
 * @param v 0 ~ 1, 0% ~ 100%
 *
 * @returns standardized HSV object
 */
export function normalizeHsv(h: number | string, s: number | string, v: number | string) {
  return {
    h: boundRange(h, 0, 360) / 360,
    s: boundRange(isPercentage(s) ? parsePercentage(s) : s, 0, 1),
    v: boundRange(isPercentage(v) ? parsePercentage(v) : v, 0, 1)
  };
}

/**
 * Normalize the original transparency value to a value between 0 ~ 1
 *
 * @param a 0 ~ 1, 0% ~ 100%
 *
 * @returns normalized transparency
 */
export function normalizeAlpha(a: number | string) {
  return boundRange(isPercentage(a) ? parsePercentage(a) : a, 0, 1);
}

/**
 * Convert HSL colors to RGB colors
 *
 * @param h 0 ~ 360
 * @param s 0 ~ 1, 0% ~ 100%
 * @param l 0 ~ 1, 0% ~ 100%
 *
 * @returns converted RGB color
 */
export function hslToRgb(h: number | string, s: number | string, l: number | string): RGBColor {
  let r, g, b
    ;({ h, s, l } = normalizeHsl(h, s, l));

  if (s === 0) {
    r = g = b = l;
  }
  else {
    const q = l < 0.5 ? (1 + s) : l + s - l * s;
    const p = (2 * l) - q;

    r = hueToRgb(p, q, (h + 1) / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, (h - 1) / 3);
  }

  r *= 255;
  g *= 255;
  b *= 255;

  return { r, g, b, toString: toRgbString };
}

/**
 * Convert RGB colors to HSL colors
 *
 * @param r 0 ~ 255
 * @param g 0 ~ 255
 * @param b 0 ~ 255
 *
 * @returns converted HSL color
 */
export function rgbToHsl(r: number | string, g: number | string, b: number | string): HSLColor {
  ;({ r, g, b } = normalizeRgb(r, g, b));

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s;

  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  }
  else {
    const d = max - min;

    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: {
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      }
      case g: {
        h = (b - r) / d + 2;
        break;
      }
      case b: {
        h = (r - g) / d + 4;
        break;
      }
      default: {
        h = 0;
      }
    }

    h *= 60;
  }

  return { h, s, l, toString: toHslString };
}

/**
 * Convert HSL colors to HSV colors
 *
 * @param h 0 ~ 360
 * @param s 0 ~ 1, 0% ~ 100%
 * @param l 0 ~ 1, 0% ~ 100%
 *
 * @returns converted HSV color
 */
export function hslToHsv(h: number | string, s: number | string, l: number | string): HSVColor {
  ;({ h, s, l } = normalizeHsl(h, s, l));

  const v = 0.5 * (2 * l + s * (1 - Math.abs(2 * l - 1)));

  s = (2 * (v - l)) / v;

  return { h: h * 360, s, v, toString: toHsvString };
}

/**
 * Convert HSV colors to HSL colors
 *
 * @param h 0 ~ 360
 * @param s 0 ~ 1, 0% ~ 100%
 * @param v 0 ~ 1, 0% ~ 100%
 *
 * @returns converted HSL color
 */
export function hsvToHsl(h: number | string, s: number | string, v: number | string): HSLColor {
  ;({ h, s, v } = normalizeHsv(h, s, v));

  const l = 0.5 * v * (2 - s);

  s = (v * s) / (1 - Math.abs((2 * l) - 1));

  return { h: h * 360, s, l, toString: toHslString };
}

/**
 * Convert HSV colors to RGB colors
 *
 * @param h 0 ~ 360
 * @param s 0 ~ 1, 0% ~ 100%
 * @param v 0 ~ 1, 0% ~ 100%
 *
 * @returns converted RGB color
 */
export function hsvToRgb(h: number | string, s: number | string, v: number | string): RGBColor {
  ;({ h, s, v } = normalizeHsv(h, s, v));

  h *= 6;

  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;

  let r = [v, q, p, p, t, v][mod];
  let g = [t, v, v, q, p, p][mod];
  let b = [p, p, t, v, v, q][mod];

  r *= 255;
  g *= 255;
  b *= 255;

  return { r, g, b, toString: toRgbString };
}

/**
 * Convert RGB colors to HSV colors
 *
 * @param r 0 ~ 255
 * @param g 0 ~ 255
 * @param b 0 ~ 255
 *
 * @returns converted HSV color
 */
export function rgbToHsv(r: number | string, g: number | string, b: number | string): HSVColor {
  ;({ r, g, b } = normalizeRgb(r, g, b));

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h;

  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  }
  else {
    switch (max) {
      case r: {
        h = ((g - b) / d) + (g < b ? 6 : 0);
        break;
      }
      case g: {
        h = ((b - r) / d) + 2;
        break;
      }
      case b: {
        h = ((r - g) / d) + 4;
        break;
      }
      default: {
        h = 0;
      }
    }

    h *= 60;
  }

  return { h, s, v, toString: toHsvString };
}

/**
 * Convert RGB colors to HEX colors
 *
 * @param r 0 ~ 255
 * @param g 0 ~ 255
 * @param b 0 ~ 255
 * @param allow3Char whether to allow 3-digit HEX value
 *
 * @returns converted HEX color
 */
export function rgbToHex(
  r: number | string,
  g: number | string,
  b: number | string,
  allow3Char = false
) {
  ;({ r, g, b } = normalizeRgb(r, g, b));

  const hex = [
    repairDigits(Math.round(r * 255).toString(16)),
    repairDigits(Math.round(g * 255).toString(16)),
    repairDigits(Math.round(b * 255).toString(16))
  ];

  if (allow3Char && isRepetitive(hex[0]) && isRepetitive(hex[1]) && isRepetitive(hex[2])) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }

  return `#${hex.join('')}`;
}

/**
 * Convert RGBA colors to HEX colors
 *
 * @param r 0 ~ 255
 * @param g 0 ~ 255
 * @param b 0 ~ 255
 * @param a 0 ~ 1, 0% ~ 100%
 * @param allow4Char whether to allow 4-digit HEX values
 *
 * @returns converted HEX color
 */
export function rgbaToHex(
  r: number | string,
  g: number | string,
  b: number | string,
  a: number | string,
  allow4Char = false
) {
  ;({ r, g, b } = normalizeRgb(r, g, b));

  const hex = [
    repairDigits(Math.round(r * 255).toString(16)),
    repairDigits(Math.round(g * 255).toString(16)),
    repairDigits(Math.round(b * 255).toString(16)),
    repairDigits(convertDecimalToHex(normalizeAlpha(a)))
  ];

  if (
    allow4Char
    && isRepetitive(hex[0])
    && isRepetitive(hex[1])
    && isRepetitive(hex[2])
    && isRepetitive(hex[3])
  ) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }

  return `#${hex.join('')}`;
}

/**
 * Mix two colors in a certain proportion
 *
 * @param color1 the first color
 * @param color2 second color
 * @param weight mixing ratio 0 ~ 1, the smaller it is, the less the first color
 *
 * @returns mixed color
 */
export function mixColor(color1: Color, color2: Color, weight = 0.5): RGBAColor {
  if (!color1 && !color2) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  if (!color1) {
    return parseColorToRgba(color2);
  }
  if (!color2) {
    return parseColorToRgba(color1);
  }

  const rgba1 = parseColorToRgba(color1);
  const rgba2 = parseColorToRgba(color2);

  const originalWeight = boundRange(weight, 0, 1);
  const normalizedWeight = (originalWeight * 2) - 1;

  const alphaDistance = rgba1.a - rgba2.a;
  const mixWeight
        = normalizedWeight * alphaDistance === -1
          ? normalizedWeight
          : (normalizedWeight + alphaDistance) / ((1 + normalizedWeight) * alphaDistance);
  const weight1 = (mixWeight + 1) / 2;
  const weight2 = 1 - weight1;

  return {
    r: Math.round(rgba1.r * weight1 + rgba2.r * weight2),
    g: Math.round(rgba1.g * weight1 + rgba2.g * weight2),
    b: Math.round(rgba1.b * weight1 + rgba2.b * weight2),
    a: Math.round(rgba1.a * originalWeight + rgba2.a * (1 - originalWeight)),
    format: 'rgba',
    toString: toRgbString
  };
}

/**
 * Adjust the transparency of a given color value
 *
 * @param color the color to be adjusted
 * @param alpha adjusted transparency 0 ~ 1, 0% ~ 100%
 *
 * @returns adjusted color
 */
export function adjustAlpha(color: Color, alpha: number | string) {
  const rgba = parseColorToRgba(color);

  rgba.a = normalizeAlpha(alpha);

  return rgba;
}

/**
 * Randomly generate a color value
 *
 * @param withAlpha whether it has transparency
 * @param type color type
 *
 * @returns generated color literal value
 */
export function randomColor(withAlpha = false, type: ColorType = 'hex') {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);

  if (type === 'hex') {
    return withAlpha ? rgbaToHex(r, g, b, Math.random()) : rgbToHex(r, g, b);
  }

  let color: ObjectColor;

  if (type === 'hsl') {
    color = rgbToHsl(r, g, b);
  }
  else if (type === 'hsv') {
    color = rgbToHsv(r, g, b);
  }
  else {
    color = Object.create({ r, g, b, toString: toRgbString });
  }

  if (withAlpha) {
    ;(color as RGBAColor).a = Math.random();
  }

  return color.toString();
}

/**
 * Randomly generate a color value of a specific hue (warm and cold colors)
 *
 * @param prefer hue
 * @param withAlpha whether it has transparency
 * @param type color type
 *
 * @returns generated color literal value
 */
export function randomPreferColor(
  prefer: 'hard' | 'soft',
  withAlpha = false,
  type: ColorType = 'hex'
) {
  const h = Math.round(Math.random() * 360);
  const s = Math.round(prefer === 'hard' ? 80 + (Math.random() * 20) : 20 + (Math.random() * 70)) / 100;
  const l = Math.round(prefer === 'hard' ? 40 + (Math.random() * 20) : 80 + (Math.random() * 15)) / 100;

  if (type === 'hsl') {
    return toHslString.bind({ h, s, l })();
  }

  let color!: ObjectColor;

  if (type === 'hex' || type === 'rgb') {
    color = hslToRgb(h, s, l);

    if (type === 'hex') {
      const { r, g, b } = color;

      return withAlpha ? rgbaToHex(r, g, b, Math.random()) : rgbToHex(r, g, b);
    }
  }
  else if (type === 'hsv') {
    color = hslToHsv(h, s, l);
  }

  if (withAlpha) {
    ;(color as RGBAColor).a = Math.random();
  }

  return color.toString();
}

/**
 * Randomly generate a cold color value
 *
 * @param withAlpha whether it has transparency
 * @param type color type
 *
 * @returns generated color literal value
 */
export function randomHardColor(withAlpha = false, type: ColorType = 'hex') {
  return randomPreferColor('hard', withAlpha, type);
}

/**
 * Randomly generate a warm color value
 *
 * @param withAlpha whether it has transparency
 * @param type color type
 *
 * @returns generated color literal value
 */
export function randomSoftColor(withAlpha = false, type: ColorType = 'hex') {
  return randomPreferColor('soft', withAlpha, type);
}

/**
 * Get the grayscale color of a given color
 *
 * @param color color literal value
 *
 * @returns the grayscale of the color
 */
export function toGrayScale(color: string) {
  return rgbToGrayScale(parseColorToRgba(color));
}

function repairDigits(str: string) {
  return str.length === 1 ? `0${str}` : str.toString();
}

function isRepetitive(string: string): boolean {
  return string.charAt(0) === string.charAt(1);
}

// function testUnit(color: number | string): boolean {
// return UNIT_REG.test(color as string)
// }

function convertDecimalToHex(number: number | string): string {
  return Math.round(Number.parseFloat(number as string) * 255).toString(16);
}

function convertHexToDecimal(hex: string): number {
  return Number.parseInt(hex, 16) / 255;
}

function boundRange(number: number | string, min: number, max: number): number {
  return Math.max(min, Math.min(max, Number.parseFloat(number as string)));
}

function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return (p + (q - p)) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return (p + (q - p)) * (((2 / 3) - t) * 6);
  }

  return p;
}

function isPercentage(percent: number | string): boolean {
  return String(percent).trim().includes('%');
}

function parsePercentage(percent: number | string): number {
  const number = Number.parseFloat(percent as string) / 100;

  return Number.isNaN(number) ? 0 : number;
}

function toRgbString(this: RGB) {
  if (isDefined(this.a) && this.a >= 0 && this.a < 1) {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  return `rgb(${this.r}, ${this.g}, ${this.b})`;
}

function toHslString(this: HSL) {
  const s = `${this.s * 100}%`;
  const l = `${this.l * 100}%`;

  if (isDefined(this.a) && this.a >= 0 && this.a < 1) {
    return `hsla(${this.h}, ${s}, ${l}, ${this.a})`;
  }

  return `hsl(${this.h}, ${s}, ${l})`;
}

function toHsvString(this: HSV) {
  const s = `${this.s * 100}%`;
  const v = `${this.v * 100}%`;

  if (isDefined(this.a) && this.a >= 0 && this.a < 1) {
    return `hsva(${this.h}, ${s}, ${v}, ${this.a})`;
  }

  return `hsv(${this.h}, ${s}, ${v})`;
}

function rgbToGrayScale(rgb: RGB) {
  return ((rgb.r * 0.2126) + (rgb.g * 0.7152) + (rgb.b * 0.0722)) / 255;
}

/**
 * Determine whether the given color is a base color
 *
 * @param color
 */
export function isBaseColor(color?: string) {
  return !!(color && Object.values(BASE_COLORS).includes(color));
}
