import { isClient } from '../utils/common';
import { adjustAlpha, isBaseColor, mixColor, parseColorToRgba } from '../utils/color.ts';

export type colorProp =
  'primary'
  | 'white'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'disabled'
  | 'accent'
  | 'critical';

export interface ColorProps {
  /**
   * Background color
   * @values transparent, primary, secondary, success, warning, danger, info, light, dark
   */
  color?: colorProp
}

export const colorProps = {
  color: {
    type: String,
    default: null,
  },
};

export const colorModifiers = [
  'primary',
  'secondary',
  'success',
  'warning',
  'danger',
  'info',

  'disabled',
  'accent',
  'critical',
];

export function getColorMap(color) {
  if (!color) {
    return null;
  }

  const rootStyle = isClient ? getComputedStyle(document.documentElement) : null;
  const black = parseColorToRgba(rootStyle?.getPropertyValue('--acv-color-black') || '#000');
  const white = parseColorToRgba(rootStyle?.getPropertyValue('--acv-color-white') || '#fff');
  const baseColor = parseColorToRgba(color);

  return {
    base: baseColor.toString(),
    light2: mixColor(white, baseColor, 0.2).toString(),
    dark1: mixColor(black, baseColor, 0.1).toString(),
    opacity1: adjustAlpha(baseColor, 0.9).toString(),
    opacity3: adjustAlpha(baseColor, 0.7).toString(),
    opacity4: adjustAlpha(baseColor, 0.6).toString(),
    opacity7: adjustAlpha(baseColor, 0.3).toString(),
    opacity8: adjustAlpha(baseColor, 0.2).toString(),
    white8: adjustAlpha(white, 0.2).toString(),
    white9: adjustAlpha(white, 0.1).toString()
  };
}

export default function useColorMixin(baseColor) {
  const colors = getColorMap(baseColor);

  return {
    isBaseColor,
    ...colors
  };
}
