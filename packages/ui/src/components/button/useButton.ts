import { computed, inject } from 'vue';
import { BUTTON_COLOR, BUTTON_GROUP_KEY, BUTTON_TYPE, BUTTON_VARIANT } from '@/components/index.ts';
import { isBaseColor } from '@/utils/color.ts';
import { colord } from '@/utils/colord.ts';

export function useButton(props) {
  const buttonGroupState = inject(BUTTON_GROUP_KEY, null);

  const isDisabled = computed(() => props.disabled || props.loading);
  const variant = computed(() => {
    if (props.type === BUTTON_TYPE.primary)
      return BUTTON_VARIANT.solid;
    if (props.type === BUTTON_TYPE.secondary)
      return BUTTON_VARIANT.outline;
    if (props.type === BUTTON_TYPE.ghost)
      return BUTTON_VARIANT.ghost;
    return props.variant ?? buttonGroupState?.variant ?? BUTTON_VARIANT.solid;
  });

  const color = computed(() => {
    if (props.type === BUTTON_TYPE.danger)
      return BUTTON_COLOR.danger;
    if (props.type === BUTTON_TYPE.inverted)
      return BUTTON_COLOR.inverted;
    return props.color ?? buttonGroupState?.color ?? BUTTON_COLOR.primary;
  });

  const size = computed(() => {
    return buttonGroupState?.size ?? props.size;
  });

  const attrs = computed(() => ({
    'role': props.is !== 'button' ? 'button' : undefined,
    'type': props.is === 'button' ? props.buttonType : undefined,
    'disabled': props.is === 'button' ? isDisabled.value : undefined,
    'aria-disabled': props.disabled || props.loading ? 'true' : undefined
  }));

  const classes = computed(() =>
    ({
      'acv-button': true,
      [variant.value]: !!variant.value,
      [size.value]: !!size.value,
      [color.value]: !!color.value,
      'disabled': !!isDisabled.value,
      'selected': props.selected,
      'loading': props.loading,
      'block': props.block,
      'pill': props.pill,
      'squared': props.squared,
    })
  );

  const styles = computed(() => {
    const isThemeColor = isBaseColor(color.value);
    const isButtonColor = Object.values(BUTTON_COLOR).includes(color.value);
    const rawColor = colord(color.value);

    return {
      ...(!isButtonColor && {
        '--acv-button-color': isThemeColor
          ? `var(--acv-color-${color.value})`
          : `hsl(${rawColor.toHslValue()})`
      }),
      ...(!isThemeColor && { '--acv-button-text-color': `${rawColor.contrasting().toHslString()}` })
    };
  });

  return {
    isDisabled,
    attrs,
    classes,
    styles,
    variant,
    color,
    size
  };
}
