// https://github.com/Qix-/color/blob/master/index.js

import { hex2hsl, hex2rgb, hsl2hex, parseRgb, rgb2hex, rgb2hsl } from './color-converters.js';

/**
 * @param  {string} color - Color in hex string or CSS-function `rgb`/`rgba`
 * @param  {number} ratio - Lighten ratio.
 * @return {string} Lightened color in hex string.
 */
export function lighten(color, ratio) {
  const hsl = color[0] === '#'
    ? hex2hsl(color)
    : rgb2hsl(parseRgb(color));

  hsl[2] += ratio;
  if (hsl[2] > 100) {
    hsl[2] = 100;
  }
  if (hsl[2] < 0) {
    hsl[2] = 0;
  }
  return hsl2hex(hsl);
}

/**
 * @param  {string} hex - Color in hex string.
 * @param  {number} ratio - Darken ratio.
 * @return {string} Darkened color in hex string.
 */
export function darken(hex, ratio) {
  return lighten(hex, -ratio);
}

/**
 * @param  {string} color - Color in hex string.
 * @param  {number} opacity
 * @return {string} rgba string
 */
export function rgba(color: string, opacity: number): string {
  const rgb = color[0] === '#'
    ? hex2rgb(color)
    : parseRgb(color);

  rgb[3] = opacity;

  return `rgba(${rgb.join(', ')})`;
}

/**
 * Colors mix, use only with hex colors without opacity.
 * @param  {string} color1 color 1 in hex or rgb string.
 * @param  {string} color2 color 2 in hex or rgb string.
 * @param  {number} weight    mix weight
 * @return {string}           result in hex string.
 */
export function mix(color1, color2, weight) {
  const rgbRegex = /^rgb/;
  const parsedColor1 = rgbRegex.test(color1) ? parseRgb(color1) : hex2rgb(color1);
  const parsedColor2 = rgbRegex.test(color2) ? parseRgb(color2) : hex2rgb(color2);

  const w = 2 * weight - 1;
  const a = 0;

  const w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
  const w2 = 1 - w1;

  const r = w1 * parsedColor1[0] + w2 * parsedColor2[0];
  const g = w1 * parsedColor1[1] + w2 * parsedColor2[1];
  const b = w1 * parsedColor1[2] + w2 * parsedColor2[2];

  return rgb2hex([r, g, b]);
}

export function isValidColor(color) {
  const s = new Option().style;
  s.color = color;
  return s.color.length > 0;
}

// TODO move to chart types
export function chartColors() {
  return typeof window !== 'undefined'
    ? [
        window.getComputedStyle(document.body).getPropertyValue('--acv-color-chart-blue'),
        window.getComputedStyle(document.body).getPropertyValue('--acv-color-chart-green'),
        window.getComputedStyle(document.body).getPropertyValue('--acv-color-chart-light-blue'),
        window.getComputedStyle(document.body).getPropertyValue('--acv-color-chart-red'),
        window.getComputedStyle(document.body).getPropertyValue('--acv-color-chart-brown'),
        window.getComputedStyle(document.body).getPropertyValue('--acv-color-chart-yellow'),
        window.getComputedStyle(document.body).getPropertyValue('--acv-color-chart-purple'),
        window.getComputedStyle(document.body).getPropertyValue('--acv-color-chart-grey')
      ]
    : [];
}
