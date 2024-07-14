<script setup lang="ts">
  import { computed, inject } from 'vue';
  import { BUTTON_GROUP_KEY, BUTTON_VARIANT, Icon } from '../index.ts';
  import { vAutofocus } from '../../directives/autofocus.ts';
  import Loader from '../loader/loader.vue';
  import { isBaseColor } from '../../utils/color.ts';
  import { colord } from '../../utils/colord.ts';
  import type { AcvButtonProps, AcvButtonSlots } from './button.ts';
  import './style/button.css';

  defineOptions({ name: 'AcvButton' });

  const props = withDefaults(defineProps<AcvButtonProps>(), {
    tag: 'button',
    buttonType: 'button',
    kind: 'solid',
    color: 'primary',
    size: 'medium'
  });

  defineSlots<AcvButtonSlots>();

  const buttonGroupState = inject(BUTTON_GROUP_KEY, null);

  const isDisabled = computed(() => props.disabled || props.loading);
  const variant = computed(() => {
    return props.variant ?? buttonGroupState?.variant ?? BUTTON_VARIANT.solid;
  });
  const size = computed(() => {
    return buttonGroupState?.size ?? props.size;
  });
  const classes = computed(() =>
    ({
      'acv-button': true,
      [variant.value]: variant.value,
      [size.value]: size.value,
      [props.color]: props.color,
      'disabled': isDisabled.value,
      'loading': props.loading,
      'block': props.block,
      'pill': props.pill,
      'squared': props.squared,
    })
  );

  const isThemeColor = isBaseColor(props.color);

  const buttonStyles = computed(() => {
    const rawColor = colord(props.color);
    return {
      '--acv-button-color': isThemeColor ? `var(--acv-color-${props.color})` : `hsl(${rawColor.toHslValue()})`,
      ...(!isThemeColor && { '--acv-button-text-color': `${rawColor.contrasting().toHslString()}` })
    };
  });

  /**
   * Disable click if component is link. Use "capture" to prevent RouterLink click
   */
  function handleClick(event: MouseEvent) {
    if (props.tag !== 'button' && isDisabled.value) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
</script>

<template>
  <component
    :is="tag"
    v-autofocus="autofocus"
    :class="classes"
    :style="buttonStyles"
    :role="props.to ? 'button' : undefined"
    :type="tag === 'button' ? buttonType : undefined"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading ? 'true' : undefined"
    @click.capture="handleClick"
  >
    <span
      v-if="loading"
      class="acv-button__loader"
    >
      <Loader size="xs" />
    </span>
    <template v-else>
      <template
        v-if="$slots.icon || icon"
      >
        <slot name="icon">
          <Icon
            v-if="icon"
            :icon="icon"
          />
        </slot>
      </template>
      <template
        v-if="$slots.default"
      >
        <span class="content"><slot /></span>
      </template>
      <template
        v-if="$slots.rightIcon || rightIcon"
      >
        <slot name="iconRight">
          <Icon
            v-if="rightIcon"
            :icon="rightIcon"
          />
        </slot>
      </template>
    </template>
  </component>
</template>
