<script setup lang="ts">
  import type { AcvButtonProps } from './button.ts';
  import { BUTTON_GROUP_KEY } from '@/components/index.ts';
  import AcvSpinner from '@/components/spinner/spinner.vue';
  import { vAutofocus } from '@/directives/autofocus.ts';
  import { computed, inject } from 'vue';
  import { BUTTON_VARIANT } from './button.ts';

  import './button.css';

  /**
   * Button is used to highlight key actions and clearly inform user of what will happen after the interaction.
   *
   * @displayName Button component
   */
  defineOptions({ name: 'AcvButton' });

  const props = withDefaults(defineProps<AcvButtonProps>(), {
    is: 'button',
    type: 'button',
    size: 'medium',
    variant: BUTTON_VARIANT.primary
  });

  // TODO: BUTTON_GROUP_KEY not working for now
  const buttonGroupState = inject(BUTTON_GROUP_KEY, null);
  const isDisabled = computed(() => Boolean(props.disabled || props.loading));
  const variant = computed(() => buttonGroupState?.variant ?? props.variant);
  const size = computed(() => buttonGroupState?.size ?? props.size);

  /**
   * Disable click if component is link. Use "capture" to prevent RouterLink click
   */
  function handleClick(event: MouseEvent) {
    if (props.is !== 'button' && isDisabled.value) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
</script>

<template>
  <component
    :is="is"
    v-autofocus="autofocus"
    :role="is !== 'button' ? 'button' : undefined"
    :type="is === 'button' ? type : undefined"
    :disabled="is === 'button' ? isDisabled : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    class="acv-button"
    :class="{
      [`acv-button_variant_${variant}`]: !!variant,
      [`acv-button_size_${size}`]: !!size,
      'acv-button_disabled': isDisabled,
      'acv-button_selected': selected,
      'acv-button_loading': loading,
      'acv-button_block': block,
      'acv-button_pill': pill,
      'acv-button_squared': squared,
    }"
    @click.capture="handleClick"
  >
    <template v-if="$slots.prepend">
      <!-- @slot Left side slot content. Usually for icon -->
      <slot name="prepend" />
    </template>
    <span
      v-if="loading"
      class="loader"
    >
      <AcvSpinner :size="size" />
    </span>
    <template v-if="$slots.default">
      <span
        class="content"
        :class="{ hidden: loading }"
      ><!-- @slot Default slot content. Usually for text --><slot /></span>
    </template>
    <template v-if="$slots.append">
      <!-- @slot Right side slot content. Usually for icon -->
      <slot name="append" />
    </template>
  </component>
</template>

<style scoped>
  .acv-button {
    align-items: center;
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
    gap: var(--acv-button-content-gap);
    height: var(--acv-button-height);
    justify-content: center;
    line-height: var(--acv-button-height);
    max-width: 100%;
    min-inline-size: var(--acv-button-min-width);
    outline: none;
    padding-block: 0;
    padding-inline: var(--acv-button-padding);
    position: relative;
    text-align: center;
    transition: all 250ms;
    white-space: nowrap;

    .content {
      overflow: hidden;
      text-overflow: ellipsis;
      place-items: center;
      display: inline-grid;
      grid-auto-flow: column;
      gap: var(--acv-button-content-gap);

      &.hidden {
        visibility: hidden;
      }
    }

    /* Sizes */

    &.acv-button_size_small {
      --acv-button-font-size: var(--acv-button-font-size-small);
      --acv-button-height: var(--acv-button-height-small);
      --acv-button-padding: var(--acv-button-padding-small);
      --acv-icon-size: var(--acv-icon-size-xx-small);
      --acv-button-content-gap: var(--acv-button-content-gap-small);
      --acv-button-min-width: var(--acv-button-min-width-small);
    }

    &.acv-button_size_medium {
      --acv-button-font-size: var(--acv-button-font-size-medium);
      --acv-button-height: var(--acv-button-height-medium);
      --acv-button-padding: var(--acv-button-padding-medium);
      --acv-icon-size: var(--acv-icon-size-x-small);
      --acv-button-content-gap: var(--acv-button-content-gap-medium);
      --acv-button-min-width: var(--acv-button-min-width-medium);
    }

    &.acv-button_size_large {
      --acv-button-font-size: var(--acv-button-font-size-large);
      --acv-button-height: var(--acv-button-height-large);
      --acv-button-padding: var(--acv-button-padding-large);
      --acv-icon-size: var(--acv-icon-size-medium);
      --acv-button-content-gap: var(--acv-button-content-gap-large);
      --acv-spinner-size: var(--acv-spinner-size-large);
      --acv-button-min-width: var(--acv-button-min-width-large);
    }

    /* Button styles */

    &.acv-button_pill {
      border-radius: var(--acv-radius-large);
    }

    &.acv-button_squared {
      border-radius: var(--acv-radius-zero);
    }

    &.acv-button_block {
      width: 100%;
    }

    /* Button variants */
    &.acv-button_variant_primary {
      --acv-button-background-color: var(
        --acv-button-primary-background-color,
        var(--acv-color-primary)
      );

      /* TODO: change hsl to colors from design system */
      --acv-button-background-color-active: var(
        --acv-button-primary-background-color-active,
        hsl(from var(--acv-color-primary) h s calc(l - 25))
      );
      --acv-button-background-color-disabled: var(
        --acv-button-primary-background-color-disabled,
        var(--acv-color-primary)
      );
      --acv-button-background-color-hover: var(
        --acv-button-primary-background-color-hover,
        hsl(from var(--acv-color-primary) h s calc(l - 15))
      );
      --acv-button-text-color: var(
        --acv-button-primary-text-color,
        var(--acv-color-text-inversed-primary)
      );
      --acv-button-text-color-disabled: var(
        --acv-button-primary-text-color-disabled,
        hsl(from var(--acv-button-text-color) h s calc(l + 10))
      );
      --acv-button-border-width: var(
        --acv-button-primary-border-width,
        var(--acv-border-none)
      );
    }

    &.acv-button_variant_secondary {
      --acv-button-color: var(--acv-color-button-secondary);
      --acv-button-background-color-active: hsl(from var(--acv-button-color) h s calc(l + 30));
      --acv-button-background-color-disabled: var(--acv-button-background-color);
      --acv-button-background-color-hover: hsl(from var(--acv-button-color) h s calc(l + 30));
      --acv-button-background-color: var(--acv-color-transparent);
      --acv-button-text-color: var(--acv-button-color);
      --acv-button-text-color-disabled: hsl(from var(--acv-button-text-color) h s calc(l + 10));
      --acv-button-text-color-hover: hsl(from var(--acv-button-text-color) h s calc(l - 10));
      --acv-button-text-color-active: hsl(from var(--acv-button-text-color) h s calc(l - 20));
      --acv-button-border-color-disabled: hsl(from var(--acv-button-color) h s calc(l + 10));
      --acv-button-border-color-hover: hsl(from var(--acv-button-color) h s calc(l - 10));
      --acv-button-border-color-active: hsl(from var(--acv-button-color) h s calc(l - 30));
      --acv-button-border-color: var(--acv-button-color);
      --acv-button-border-width: var(--acv-border-regular);
    }

    &.acv-button_variant_ghost {
      --acv-button-color: var(--acv-color-primary);
      --acv-button-background-color-active: hsl(from var(--acv-button-color) h calc(s - 12) calc(l + 23));
      --acv-button-background-color-disabled: hsl(from var(--acv-button-background-color) h s calc(l + 10));
      --acv-button-background-color-hover: hsl(from var(--acv-button-color) calc(h - 1) calc(s - 11) calc(l + 33));
      --acv-button-background-color: var(--acv-color-transparent);
      --acv-button-text-color: var(--acv-button-color);
      --acv-button-text-color-active: hsl(from var(--acv-button-color) h s calc(l - 20));
      --acv-button-text-color-disabled: hsl(from var(--acv-button-color) h s calc(l - 10));
      --acv-button-text-color-hover: hsl(from var(--acv-button-color) h s calc(l - 10));
      --acv-button-border-width: var(--acv-base-border-width-00);
    }

    &.acv-button_inverted {
      --acv-button-color: var(--acv-color-button-inversed);
      --acv-button-background-color-active: var(--acv-color-button-active-inversed);
      --acv-button-background-color-disabled: var(--acv-color-button-disabled-inversed);
      --acv-button-background-color-hover: var(--acv-color-button-hover-inversed);
      --acv-button-background-color: var(--acv-color-button-inversed);
      --acv-button-text-color: var(--acv-color-link-inversed-primary);
      --acv-button-text-color-disabled: var(--acv-color-link-disabled-inversed);
    }

    &.acv-button_variant_status {
      --acv-button-color: var(--acv-color-critical);
      --acv-button-background-color-active: var(--acv-color-button-danger);
      --acv-button-background-color-disabled: var(--acv-color-button-danger);
      --acv-button-background-color-hover: var(--acv-color-button-danger);
      --acv-button-background-color: var(--acv-color-critical-background);
      --acv-button-text-color: var(--acv-color-button-danger);
      --acv-button-text-color-hover: var(--acv-color-button-danger);
      --acv-button-border-color: var(--acv-color-button-danger);
    }

    &.acv-button_loading {
      cursor: default;
    }

    /* States */

    &:hover:not(.acv-button_disabled, .acv-button_loading),
    &.acv-button_hover:not(.acv-button_disabled, .acv-button_loading) {
      --acv-button-border-color: var(--acv-button-border-color-hover);
      --acv-button-background-color: var(--acv-button-background-color-hover);
      --acv-button-text-color: var(--acv-button-text-color-hover);
      cursor: pointer;
    }

    &:active,
    &.acv-button_active {
     transform: translateY(1px);
    }

    &:active,
    &.acv-button_active,
    &.acv-button_selected {
      --acv-button-background-color: var(--acv-button-background-color-active);
      --acv-button-border-color: var(--acv-button-border-color-active);
      --acv-button-text-color: var(--acv-button-text-color-active, currentColor);
    }

    &:focus-visible,
    &.acv-button_focus {
      outline: var(--acv-button-focus-outline);
    }

    &:disabled,
    &[disabled],
    &.acv-button_disabled {
      background-color: var(--acv-button-background-color-disabled);
      color: var(--acv-button-text-color-disabled);
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
      box-shadow: none;

      &:not(.acv-button_inverted) {
        --acv-button-border-color: var(--acv-button-border-color-disabled);
      }
    }

    /* Elements */

    .loader {
      position: absolute;
      display: flex;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
</style>
