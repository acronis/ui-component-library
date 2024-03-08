/* eslint-disable no-mixed-operators */
// https://github.com/Qix-/color/blob/master/index.js

import { hex2hsl, hsl2hex, hex2rgb, rgb2hex, rgb2hsl, parseRgb } from './color-converters';

/**
 * @param  {String} color - Color in hex string or CSS-function `rgb`/`rgba`
 * @param  {Number} ratio - Lighten ratio.
 * @return {String} Lightened color in hex string.
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
 * @param  {String} hex - Color in hex string.
 * @param  {Number} ratio - Darken ratio.
 * @return {String} Darkened color in hex string.
 */
export function darken(hex, ratio) {
  return lighten(hex, -ratio);
}

/**
 * @param  {String} color - Color in hex string.
 * @param  {Number} opacity
 * @return {String} rgba string
 */
export function rgba(color, opacity) {
  const rgb = color[0] === '#'
    ? hex2rgb(color)
    : parseRgb(color);

  rgb[3] = opacity;

  return `rgba(${rgb.join(', ')})`;
}

/**
 * Colors mix, use only with hex colors without opacity.
 * @param  {String} color1 color 1 in hex or rgb string.
 * @param  {String} color2 color 2 in hex or rgb string.
 * @param  {Number} weight    mix weight
 * @return {String}           result in hex string.
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

export const isValidColor = (color) => {
  const s = new Option().style;
  s.color = color;
  return s.color.length > 0;
};

export const chartColors = () => {
  return [
    getComputedStyle(document.body).getPropertyValue('--av-chart-blue'),
    getComputedStyle(document.body).getPropertyValue('--av-chart-green'),
    getComputedStyle(document.body).getPropertyValue('--av-chart-light-blue'),
    getComputedStyle(document.body).getPropertyValue('--av-chart-red'),
    getComputedStyle(document.body).getPropertyValue('--av-chart-brown'),
    getComputedStyle(document.body).getPropertyValue('--av-chart-yellow'),
    getComputedStyle(document.body).getPropertyValue('--av-chart-purple'),
    getComputedStyle(document.body).getPropertyValue('--av-chart-grey')
  ];
};
