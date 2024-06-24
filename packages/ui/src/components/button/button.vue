<script setup lang="ts">
  import { computed, inject } from 'vue';
  import { BUTTON_COLOR, BUTTON_GROUP_KEY, Icon } from '../index.ts';
  import { vAutofocus } from '../../directives/autofocus.ts';
  import Loader from '../loader/loader.vue';
  import type { AcvButtonProps, AcvButtonSlots } from './button.ts';
  import './style/button.variables.css';
  import './style/button.scss';

  defineOptions({ name: 'AcvButton' });

  const props = withDefaults(defineProps<AcvButtonProps>(), {
    tag: 'button',
    buttonType: 'button',
    variant: 'primary',
    size: 'medium'
  });

  defineSlots<AcvButtonSlots>();

  const buttonGroupState = inject(BUTTON_GROUP_KEY, null);

  const isDisabled = computed(() => props.disabled || props.loading);
  const kind = computed(() => {
    return props.kind ?? buttonGroupState?.kind ?? 'solid';
  });
  const size = computed(() => {
    return buttonGroupState?.size ?? props.size;
  });
  const isSolid = kind.value === 'solid' || (Object.keys(BUTTON_COLOR).includes(props.variant) && !['outline', 'ghost'].includes(kind.value));
  const classes = computed(() =>
    ({
      'acv-button': true,
      [props.variant]: props.variant,
      [size.value]: size.value && size.value !== 'medium',
      [kind.value]: kind.value,
      'disabled': isDisabled.value,
      'loading': props.loading,
      'solid': isSolid,
      'outline': kind.value === 'outline' || (['secondary'].includes(props.variant) && !['ghost', 'solid'].includes(kind.value)),
      'ghost': kind.value === 'ghost' || (['ghost'].includes(props.variant) && !['outline', 'solid'].includes(kind.value)),
      'block': props.block,
      'pill': props.pill,
      'squared': props.squared,
    })
  );

  const buttonStyles = computed(() => {
    return {
      // '--acv-button-background-color': props.color ? props.color : undefined,
      // '--acv-button-border-color': props.color ? props.color : undefined,
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
      <span
        v-if="$slots.icon || icon"
        class="acv-button__icon"
      >
        <slot name="icon">
          <Icon
            v-if="icon"
            :icon="icon"
          />
        </slot>
      </span>
      <span
        v-if="$slots.default"
        :class="loading && 'acv-button__text_loading'"
        class="acv-button__text"
      >
        <slot></slot>
      </span>
      <span
        v-if="rightIcon"
        class="acv-button__icon"
      >
        <slot name="rightIcon">
          <Icon
            :icon="rightIcon"
          />
        </slot>
      </span>
    </template>
  </component>
</template>
