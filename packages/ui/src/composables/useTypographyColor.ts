import type { MaybeRefOrGetter } from '@vueuse/core';
import { toValue } from '@vueuse/core';
import { ref, watch } from 'vue';
import { colord } from '../utils/colord.ts';
import { isBaseColor } from '../utils/color.ts';
import type { ColorProp } from '../types/props.ts';

function calculateColor(_isThemeColor: boolean, _color: ColorProp | null, _variant: string) {
  const classes: string[] = [];
  const styles: string[] = [];

  /**
   * If it's theme color update the color accordingly and set title & subtitle opacity to 1
   * Else
   *  If color is `undefined` => Don't do anything let typography inherit the styles from parent
   *  Color is null => Reset styling to initial => 0.87 opacity for title & .38 for subtitle
   */

  if (_isThemeColor) {
    classes.push('acv-title-opacity-100 acv-subtitle-opacity-100');
    if (_variant !== 'solid') {
      classes.push(`acv-title-${_color} acv-subtitle-${_color}`);
    }
    else { styles.push('--acv-title-color: 0, 0%, 100%; --acv-subtitle-color: 0, 0%, 100%'); } // white
  }
  else if (_color !== undefined) {
    const typographyC = _color === null ? 'var(--acv-base-color)' : colord(_color).toHslValue();

    styles.push(`--acv-title-color: ${typographyC}; --acv-subtitle-color: ${typographyC};`);
    classes.push(
      _color === null
        ? '[--acv-title-opacity:var(--acv-text-emphasis-high-opacity)] [--acv-subtitle-opacity:var(--acv-text-emphasis-light-opacity)]'
        : 'acv-subtitle-opacity-100',
    );
  }

  return {
    classes,
    styles,
  };
}

export function useTypographyColor(color: MaybeRefOrGetter<ColorProp>, variant: MaybeRefOrGetter<string>) {
  const typographyClasses = ref<string[]>([]);
  const typographyStyles = ref<string[]>([]);

  const _color = toValue(color);
  const _variant = toValue(variant);
  const _isThemeColor = isBaseColor(_color);

  watch([() => color, () => variant], () => {
    const calculatedColor = calculateColor(_isThemeColor, _color, _variant);
    typographyClasses.value = calculatedColor.classes;
    typographyStyles.value = calculatedColor.styles;
  }, { immediate: true });

  return {
    typographyClasses,
    typographyStyles,
  };
}
