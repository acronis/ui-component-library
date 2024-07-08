import { ref, unref, watch } from 'vue';
// import { useTypographyColor } from '@/composables/useTypographyColor';
import { colord } from '../utils/colord.ts';
import { isBaseColor } from '../utils/color.ts';
import type { ColorProp, ColorProps } from '../types/props.ts';

export const LAYER_VARIANT = {
  solid: 'solid',
  outline: 'outline',
  ghost: 'ghost',
  light: 'light'
} as const;
export type LayerVariant = typeof LAYER_VARIANT[keyof typeof LAYER_VARIANT];

export interface AcvLayerProps extends ColorProps {
  /**
   * Layer variant
   * @values 'solid' | 'outline' | 'ghost' | 'light'
   * @defaultValue 'solid'
   */
  variant?: LayerVariant

  /**
   * Interaction states like hover & active
   * @defaultValue false
   */
  states?: boolean
}

/**
 * Computes classes and styles for a layer based on its color, variant, and state.
 *
 * This function dynamically generates CSS classes and style objects for a layer component,
 * allowing for a flexible design system that adapts to changes in color, variant, and state.
 * It supports theme colors, inheritance, and custom colors, along with various layer variants
 * and interactive states.
 *
 * @param {ColorProp} color - The color of the layer. Can be a theme color, 'inherit', or any valid CSS color.
 * @param {string} [variant] - The variant of the layer. Determines the layer's appearance. Optional.
 * @param {boolean} [enableStates] - Flag indicating if interactive states (like hover & active) are enabled. Optional.
 *
 * @returns {object} An object containing two arrays: `styles` and `classes`.
 *                   `styles` is an array of style objects to be applied to the layer.
 *                   `classes` is an array of class names to be applied to the layer.
 */
function computeClassesStyles(color: ColorProp, variant?: string, enableStates?: boolean) {
  const styles: object[] = [];
  const classes: any[] = ['acv-layer', variant];
  if (enableStates) {
    classes.push('with-states');
  }
  // const { typographyClasses, typographyStyles } = useTypographyColor(color, variant);

  // classes.push(typographyClasses.value);
  // styles.push(typographyStyles.value);

  const isThemeColor = isBaseColor(color);
  const borderColor = `var(--acv-layer-background-color)`;

  if (isThemeColor) {
    const themeColorStyle = `var(--acv-color-${color})`;
    classes.push(color);
    styles.push({ '--acv-layer-color': themeColorStyle });

    switch (variant) {
      case LAYER_VARIANT.solid:
        styles.push({
          background: 'var(--acv-layer-color)',
          color: `var(--acv-color-${color}-text, var(--acv-color-white))`
        });
        classes.push('acv-text-color-white', `acv-text-color-${color}`);
        break;
      case LAYER_VARIANT.ghost:
        classes.push(`acv-text-${color}`);
        break;
      case LAYER_VARIANT.outline:
        classes.concat(['acv-border-width-regular', 'acv-border-style-solid', 'outline', `acv-text-${color}`]);
        break;
      case LAYER_VARIANT.light:
        classes.push(`acv-text-${color}`);
        break;
    }
  }
  else if (color === 'inherit') {
    classes.push('text-inherit');

    if (variant === LAYER_VARIANT.outline) {
      classes.push('acv-border-width-regular', 'acv-border-style-solid', 'acv-border-color-current');
    }
  }
  else if (color) {
    const _colord = colord(color);

    styles.push({ '--acv-layer-color': _colord.toHslValue() });

    if (variant === LAYER_VARIANT.solid) {
      styles.push({ background: 'hsla(var(--acv-layer-color), 1)' });
      styles.push({ color: _colord.contrasting().toHslString() });
    }
    else if (variant === LAYER_VARIANT.ghost) {
      styles.push({ color: borderColor });
    }
    else if (variant === LAYER_VARIANT.outline) {
      classes.push('acv-border-width-regular', 'acv-border-style-solid');

      styles.push({
        borderColor,
        color: borderColor
      });
    }
    else if (variant === LAYER_VARIANT.light) {
      styles.push({
        background: 'hsla(var(--acv-layer-color), 0.15)',
        color: borderColor
      });
    }
  }

  return {
    styles,
    classes,
  };
}

/**
 * A composable function to manage layer classes and styles based on provided color, variant, and state properties.
 * It watches changes to these properties and updates the layer's classes and styles accordingly.
 *
 * @param {object} options - The options object containing layer properties.
 * @param {ColorProp} options.propColor - The color property of the layer, which can be a theme color, 'inherit', or any valid CSS color.
 * @param {LayerVariant} options.propVariant - The variant of the layer, determining its appearance. Can be 'solid', 'outline', 'ghost', or 'text'.
 * @param {boolean} options.propStates - A boolean indicating whether interaction states (like hover & active) should be enabled.
 *
 * @returns {object} An object containing two reactive properties: `layerClasses` and `layerStyles`.
 * `layerClasses` is an array of class names to be applied to the layer.
 * `layerStyles` is an array of style objects to be applied to the layer.
 */
export function useLayer({ propColor, propVariant, propStates }) {
  const layerClasses = ref<any>([]);
  const layerStyles = ref<any>([]);

  watch([propColor, propVariant, propStates], () => {
    const { classes: _classes, styles: _styles } = computeClassesStyles(
      unref(propColor),
      unref(propVariant),
      unref(propStates)
    );
    layerClasses.value = _classes;
    layerStyles.value = _styles;
  }, { immediate: true });

  return {
    layerClasses,
    layerStyles
  };
}
