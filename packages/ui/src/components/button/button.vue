<script setup lang="ts">
  import { computed, inject } from 'vue';
  import { BUTTON_COLOR, BUTTON_VARIANT } from './button.ts';
  import type { AcvButtonProps, AcvButtonSlots } from './button.ts';
  import AcvIcon from '@/components/icon/icon.vue';
  import { BUTTON_GROUP_KEY } from '@/components/button-group/buttonGroup.ts';
  import { vAutofocus } from '@/directives/autofocus.ts';
  import Loader from '@/components/loader/loader.vue';
  import { isBaseColor } from '@/utils/color.ts';
  import { colord } from '@/utils/colord.ts';
  import './button.css';

  defineOptions({ name: 'AcvButton' });

  const props = withDefaults(defineProps<AcvButtonProps>(), {
    tag: 'button',
    buttonType: 'button',
    color: 'primary',
    size: 'medium'
  });

  defineSlots<AcvButtonSlots>();

  const buttonGroupState = inject(BUTTON_GROUP_KEY, null);

  const isDisabled = computed(() => props.disabled || props.loading);
  const variant = computed(() => {
    if (props.type === 'primary')
      return BUTTON_VARIANT.solid;
    if (props.type === 'secondary')
      return BUTTON_VARIANT.outline;
    if (props.type === 'ghost')
      return BUTTON_VARIANT.ghost;
    return props.variant ?? buttonGroupState?.variant ?? BUTTON_VARIANT.solid;
  });
  const color = computed(() => {
    if (props.type === 'danger')
      return BUTTON_COLOR.danger;
    if (props.type === 'inverted')
      return BUTTON_COLOR.inverted;
    return props.color ?? buttonGroupState?.color ?? BUTTON_COLOR.primary;
  });
  const size = computed(() => {
    return buttonGroupState?.size ?? props.size;
  });
  const classes = computed(() =>
    ({
      'acv-button': true,
      [variant.value]: variant.value,
      [size.value]: size.value,
      [color.value]: color.value,
      'disabled': isDisabled.value,
      'loading': props.loading,
      'block': props.block,
      'pill': props.pill,
      'squared': props.squared,
    })
  );

  const isThemeColor = isBaseColor(color.value);

  const buttonStyles = computed(() => {
    const rawColor = colord(color.value);
    return {
      ...(!isThemeColor && { '--acv-button-color': isThemeColor
        ? `var(--acv-color-${color.value})`
        : `hsl(${rawColor.toHslValue()})`
      }),
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
          <AcvIcon
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
          <AcvIcon
            v-if="rightIcon"
            :icon="rightIcon"
          />
        </slot>
      </template>
    </template>
  </component>
</template>

<style scoped>
  .acv-button {
    align-items: center;
    appearance: none;
    background-clip: padding-box;
    background-color: var(--acv-button-background-color);
    block-size: var(--acv-button-height);
    border-color: var(--acv-button-border-color);
    border-radius: var(--acv-button-border-radius);
    border-style: var(--acv-button-border-style);
    border-width: var(--acv-button-border-width);
    color: var(--acv-button-text-color);
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    font-family: var(--acv-font-family-default), sans-serif;
    font-size: var(--acv-button-font-size);
    font-weight: var(--acv-font-weight-strong);
    height: var(--acv-button-height);
    justify-content: center;
    line-height: var(--acv-button-height);
    max-width: 100%;
    outline: none;
    padding-block: 0;
    padding-inline: var(--acv-button-padding);
    position: relative;
    text-align: center;
    transition: all 250ms;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;

    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      place-items: center;
      display: inline-grid;
      grid-auto-flow: column;
    }

    /* Sizes */

    &.small {
      --acv-button-font-size: var(--acv-button-font-size-small);
      --acv-button-height: var(--acv-button-height-small);
      --acv-button-padding: var(--acv-button-padding-small);
      --acv-icon-size: var(--acv-icon-size-xxs);
    }

    &.medium {
      --acv-button-font-size: var(--acv-button-font-size-medium);
      --acv-button-height: var(--acv-button-height-medium);
      --acv-button-padding: var(--acv-button-padding-medium);
      --acv-icon-size: var(--acv-icon-size-md);
    }

    &.large {
      --acv-button-font-size: var(--acv-button-font-size-large);
      --acv-button-height: var(--acv-button-height-large);
      --acv-button-padding: var(--acv-button-padding-large);
      --acv-icon-size: var(--acv-icon-size-lg);
    }

    /* Button styles */

    &.pill {
      border-radius: var(--acv-radius-large);
    }

    &.squared {
      border-radius: var(--acv-radius-zero);
    }

    &.block {
      display: block;
      width: 100%;
    }

    /* Button variants */

    &.solid {
      --acv-button-background-color-active: hsl(
          from var(--acv-button-color) h s calc(l - 25)
      );
      --acv-button-background-color-disabled: var(
          --acv-button-background-color
      );
      --acv-button-background-color-hover: hsl(
          from var(--acv-button-color) h s calc(l - 15)
      );
      --acv-button-background-color: var(--acv-button-color);
      --acv-button-border-width: var(--acv-border-none);
      --acv-button-text-color-disabled: hsl(
          from var(--acv-button-text-color) h s calc(l + 10)
      );
      --acv-button-text-color: var(--acv-color-text-inversed-primary);
    }

    &.outline {
      --acv-button-background-color-active: hsl(
          from var(--acv-button-color) h s calc(l + 30)
      );
      --acv-button-background-color-disabled: var(
          --acv-button-background-color
      );
      --acv-button-background-color-hover: hsl(
          from var(--acv-button-color) h s calc(l + 30)
      );
      --acv-button-background-color: var(--acv-color-transparent);
      --acv-button-border-color-active: hsl(
          from var(--acv-button-color) h s calc(l - 30)
      );
      --acv-button-border-color-disabled: var(--acv-button-text-color-disabled);
      --acv-button-border-color-hover: hsl(
          from var(--acv-button-color) h s calc(l - 10)
      );
      --acv-button-border-color: var(--acv-button-color);
      --acv-button-border-width: var(--acv-border-regular);
      --acv-button-text-color-active: hsl(
          from var(--acv-button-text-color) h s calc(l - 20)
      );
      --acv-button-text-color-disabled: hsl(
          from var(--acv-button-text-color) h s calc(l + 10)
      );
      --acv-button-text-color-hover: hsl(
          from var(--acv-button-text-color) h s calc(l - 10)
      );
      --acv-button-text-color: var(--acv-button-color);
    }

    &.ghost {
      --acv-button-background-color-active: hsl(
          from var(--acv-button-color) h calc(s - 12) calc(l + 23)
      );
      --acv-button-background-color-disabled: hsl(
          from var(--acv-button-background-color) h s calc(l + 10)
      );
      --acv-button-background-color-hover: hsl(
          from var(--acv-button-color) calc(h - 1) calc(s - 11) calc(l + 33)
      );
      --acv-button-background-color: var(--acv-color-transparent);
      --acv-button-border-width: var(--acv-base-border-width-00);
      --acv-button-text-color-active: hsl(
          from var(--acv-button-text-color) h s calc(l - 20)
      );
      --acv-button-text-color-disabled: hsl(
          from var(--acv-button-text-color) h s calc(l - 10)
      );
      --acv-button-text-color-hover: hsl(
          from var(--acv-button-text-color) h s calc(l - 10)
      );
      --acv-button-text-color: var(--acv-button-color);
    }

    &.light {
      --acv-button-background-color-active: hsl(
          from var(--acv-button-background-color) calc(h - 5) calc(s + 5)
          calc(l - 20)
      );
      --acv-button-background-color-disabled: hsl(
          from var(--acv-button-background-color) h s calc(l + 10)
      );
      --acv-button-background-color-hover: hsl(
          from var(--acv-button-background-color) h s calc(l - 10)
      );
      --acv-button-background-color: hsl(
          from var(--acv-button-color) h s l / 0.4
      );
      --acv-button-text-color-active: hsl(
          from var(--acv-color-text-secondary) h s calc(l - 30)
      );
      --acv-button-text-color-hover: hsl(
          from var(--acv-color-text-secondary) h s calc(l - 20)
      );
      --acv-button-text-color: var(--acv-color-text-secondary);
    }

    /* Button colors */

    &.primary {
      --acv-button-color: var(--acv-color-primary);

      &.solid {
        --acv-button-background-color-active: var(
            --acv-color-button-active-primary
        );
        --acv-button-background-color-disabled: var(
            --acv-color-button-disabled
        );
        --acv-button-background-color-hover: var(
            --acv-color-button-hover-primary
        );
        --acv-button-text-color: var(--acv-color-text-inversed-primary);
      }
    }

    &.secondary {
      --acv-button-color: var(--acv-color-button-secondary);
    }

    &.inverted {
      --acv-button-color: var(--acv-color-button-inversed);
      --acv-button-background-color-active: var(
          --acv-color-button-active-inversed
      );
      --acv-button-background-color-disabled: var(
          --acv-color-button-disabled-inversed
      );
      --acv-button-background-color-hover: var(
          --acv-color-button-hover-inversed
      );
      --acv-button-background-color: var(--acv-color-button-inversed);
      --acv-button-text-color-disabled: var(--acv-color-link-disabled-inversed);
      --acv-button-text-color: var(--acv-color-link-inversed-primary);
    }

    &.neutral {
      --acv-button-color: var(--acv-color-neutral);
    }

    &.info {
      --acv-button-color: var(--acv-color-info);

      &.outline {
        --acv-button-border-color: var(--acv-color-info-border);
        --acv-button-text-color: var(--acv-color-info-text);
        --acv-button-text-color-hover: var(--acv-color-info-text);
      }
    }

    &.success {
      --acv-button-color: var(--acv-color-success);

      &.outline {
        --acv-button-border-color: var(--acv-color-success-border);
        --acv-button-text-color: var(--acv-color-success-text);
        --acv-button-text-color-hover: var(--acv-color-success-text);
      }
    }

    &.warning {
      --acv-button-color: var(--acv-color-warning);

      &.outline {
        --acv-button-border-color: var(--acv-color-warning);
        --acv-button-text-color: var(--acv-color-warning-text);
        --acv-button-text-color-hover: var(--acv-color-warning-text);
      }
    }

    &.critical {
      --acv-button-color: var(--acv-color-critical);
    }

    &.danger {
      --acv-button-color: var(--acv-color-button-danger);

      &.outline {
        --acv-button-border-color: var(--acv-color-button-danger);
        --acv-button-text-color: var(--acv-color-button-danger);
        --acv-button-text-color-hover: var(--acv-color-button-danger);
      }
    }

    &.loading {
      cursor: default;
    }

    &.white {
      &.solid {
        --acv-button-text-color: var(--acv-color-text-primary);
      }
    }

    /* States */

    &:hover:not(.disabled, .loading),
    &.hover:not(.acv-button--disabled, .acv-button--loading) {
      background-color: var(--acv-button-background-color-hover);
      border-color: var(--acv-button-border-color-hover);
      color: var(--acv-button-text-color-hover);
      cursor: pointer;
    }

    &:active,
    &.active {
      background: var(--acv-button-background-color-active);
      border-color: var(--acv-button-border-color-active);
      color: var(--acv-button-text-color-active, currentColor);
    }

    &:focus-visible,
    &.focus {
      outline: var(--acv-button-focus-outline);
    }

    &:disabled,
    &[disabled],
    &.disabled {
      background-color: var(--acv-button-background-color-disabled);
      color: var(--acv-button-text-color-disabled);
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
      box-shadow: none;

      &:not(.inverted) {
        border-color: var(--acv-button-border-color-disabled);
      }
    }

    &:deep(svg),
    &:deep(path) {
      fill: currentColor;
    }

    /* Elements */

    .acv-button__loader {
      position: absolute;
      display: flex;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      transform: translateX(-50%) translateY(-50%);
    }

    .acv-icon:first-child:not(:last-child) {
      margin-inline-end: var(--acv-button-padding);
    }

    .acv-icon:last-child:not(:first-child) {
      margin-inline-start: var(--acv-button-padding);
    }
  }
</style>
