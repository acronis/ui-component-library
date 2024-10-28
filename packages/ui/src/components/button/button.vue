<script setup lang="ts">
  import type { AcvButtonProps } from './button.ts';
  import { BUTTON_GROUP_KEY } from '@/components/index.ts';
  import AcvSpinner from '@/components/spinner/spinner.vue';
  import { vAutofocus } from '@/directives/autofocus.ts';
  import { computed, inject } from 'vue';
  import { BUTTON_VARIANT } from './button.ts';

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
    border-radius: var(--acv-button-border-radius, var(--acv-radius-regular));
    border-style: var(--acv-button-border-style, var(--acv-border-style-solid));
    border-width: var(--acv-border-regular);
    cursor: pointer;
    display: inline-flex;
    flex-shrink: 0;
    font-family: var(--acv-font-family-default);
    font-weight: var(--acv-font-weight-strong);
    justify-content: center;

    /* TODO: line-height? */

    /* line-height: var(--acv-button-height); */
    max-width: 100%;
    outline: none;
    padding-block: 0;
    position: relative;
    text-align: center;

    /* TODO: transition css variable */
    transition: all 250ms;

    /* TODO: flag for nowrap */
    white-space: nowrap;

    .content {
      /* TODO: flag for ellipsis */
      text-overflow: ellipsis;
      place-items: center;
      display: inline-grid;
      grid-auto-flow: column;

      &.hidden {
        visibility: hidden;
      }
    }

    /* Sizes */

    &.acv-button_size_small {
      --acv-icon-size: var(--acv-icon-size-xx-small);
      gap: var(--acv-button-size-small-content-gap, var(--acv-spacing-x-small));
      min-inline-size: var(--acv-button-size-small-min-inline-size, 24px);
      padding-inline: var(--acv-spacing-x-small);
      block-size: var(--acv-height-small);
      font-size: var(--acv-font-size-caption);
    }

    &.acv-button_size_medium {
      --acv-icon-size: var(--acv-icon-size-x-small);
      gap: var(--acv-button-size-medium-content-gap, var(--acv-spacing-small));
      min-inline-size: var(--acv-button-size-medium-min-inline-size, 32px);
      padding-inline: var(--acv-spacing-small);
      font-size: var(--acv-font-size-body);
      block-size: var(--acv-height-regular);
    }

    &.acv-button_size_large {
      --acv-icon-size: var(--acv-icon-size-medium);

      /* TODO: make spinner = icon and remove it from here */
      --acv-spinner-size: var(--acv-spinner-size-large);
      gap: var(--acv-button-size-large-content-gap, var(--acv-spacing-regular));
      min-inline-size: var(--acv-button-size-large-min-inline-size, 48px);
      padding-inline: var(--acv-spacing-regular);
      font-size: var(--acv-font-size-lead);
      block-size: var(--acv-height-x-large);
    }

    /* Button styles */

    &.acv-button_pill {
      border-radius: var(--acv-radius-large);
    }

    &.acv-button_squared {
      border-radius: var(--acv-radius-zero);
    }

    &.acv-button_block {
      inline-size: 100%;
    }

    /* Button variants */
    &.acv-button_variant_primary {
      --_acv-button-color: var(
        --acv-button-primary-color,
        var(--acv-color-button-primary)
      );
      --_acv-button-background-color-hover: var(
        --acv-button-primary-background-color-hover,
        var(--acv-color-button-hover-primary)
      );
      --_acv-button-background-color-active: var(
        --acv-button-primary-background-color-active,
        var(--acv-color-button-active-primary)
      );
      --_acv-button-background-color-disabled: var(
        --acv-button-primary-background-color-disabled,
        var(--acv-color-button-disabled)
      );
      --_acv-button-text-color-hover: var(
        --acv-button-primary-text-color-hover,
        var(--acv-color-button-label-inversed-primary)
      );
      --_acv-button-text-color-active: var(
        --acv-button-primary-text-color-active,
        var(--acv-color-button-label-inversed-primary)
      );
      --_acv-button-text-color-disabled: var(
        --acv-button-primary-text-color-disabled,
        var(--acv-color-button-label-disabled-inversed)
      );
      --_acv-button-border-color-hover: var(
        --acv-button-primary-border-color-hover,
        var(--acv-color-button-hover-primary)
      );
      --_acv-button-border-color-active: var(
        --acv-button-primary-border-color-active,
        var(--acv-color-button-active-primary)
      );
      --_acv-button-border-color-disabled: var(
        --acv-button-primary-border-color-disabled,
        var(--acv-color-button-disabled)
      );
      border-color: var(
        --acv-button-primary-border-color,
        var(--_acv-button-color)
      );
      background-color: var(
        --acv-button-primary-background-color,
        var(--_acv-button-color)
      );
      color: var(
        --acv-button-primary-text-color,
        var(--acv-color-button-label-inversed-primary)
      );
    }

    &.acv-button_variant_secondary {
      --_acv-button-color: var(
        --acv-button-secondary-color,
        var(--acv-color-button-secondary)
      );
      --_acv-button-background-color-hover: var(
        --acv-button-secondary-background-color-hover,
        var(--acv-color-button-hover-secondary)
      );
      --_acv-button-background-color-active: var(
        --acv-button-secondary-background-color-active,
        var(--acv-color-button-active-secondary)
      );
      --_acv-button-background-color-disabled: var(
        --acv-button-secondary-background-color-disabled,
        var(--acv-color-button-disabled-inversed)
      );
      --_acv-button-text-color-hover: var(
        --acv-button-secondary-text-color-hover,
        var(--acv-color-button-label-primary)
      );
      --_acv-button-text-color-active: var(
        --acv-button-secondary-text-color-active,
        var(--acv-color-button-label-primary)
      );
      --_acv-button-text-color-disabled: var(
        --acv-button-secondary-text-color-disabled,
        var(--acv-color-button-label-disabled)
      );
      --_acv-button-border-color-hover: var(
        --acv-button-secondary-border-color-hover,
        var(--acv-color-button-hover-primary)
      );
      --_acv-button-border-color-active: var(
        --acv-button-secondary-border-color-active,
        var(--acv-color-button-hover-primary)
      );
      --_acv-button-border-color-disabled: var(
        --acv-button-secondary-border-color-disabled,
        var(--acv-color-button-disabled)
      );
      background-color: var(
        --acv-button-secondary-background-color,
        var(--acv-color-transparent)
      );
      color: var(
        --acv-button-secondary-text-color,
        var(--_acv-button-color)
      );
      border-color: var(
        --acv-button-secondary-border-color,
        var(--_acv-button-color)
      );
    }

    &.acv-button_variant_ghost {
      --_acv-button-color: var(
        --acv-button-ghost-color,
        var(--acv-color-button-secondary)
      );
      --_acv-button-background-color-hover: var(
        --acv-button-ghost-background-color-hover,
        var(--acv-color-button-hover-secondary)
      );
      --_acv-button-background-color-active: var(
        --acv-button-ghost-background-color-active,
        var(--acv-color-button-active-secondary)
      );
      --_acv-button-background-color-disabled: var(
        --acv-button-ghost-background-color-disabled,
        var(--acv-color-button-disabled-inversed)
      );
      --_acv-button-text-color-hover: var(
        --acv-button-ghost-text-color-hover,
        var(--acv-color-button-label-primary)
      );
      --_acv-button-text-color-active: var(
        --acv-button-ghost-text-color-active,
        var(--acv-color-button-label-primary)
      );
      --_acv-button-text-color-disabled: var(
        --acv-button-ghost-text-color-disabled,
        var(--acv-color-button-label-disabled)
      );
      --_acv-button-border-color-hover: var(
        --acv-button-ghost-border-color-hover,
        var(--acv-color-button-hover-secondary)
      );
      --_acv-button-border-color-active: var(
        --acv-button-ghost-border-color-active,
        var(--acv-color-button-active-secondary)
      );
      --_acv-button-border-color-disabled: var(
        --acv-button-ghost-border-color-disabled,
        var(--acv-color-transparent)
      );
      background-color: var(
        --acv-button-ghost-background-color,
        var(--acv-color-transparent)
      );
      color: var(
        --acv-button-ghost-text-color,
        var(--_acv-button-color)
      );
      border-color: var(
        --acv-button-secondary-border-color,
        var(--acv-color-transparent)
      );
    }

    &.acv-button_variant_inverted {
      --_acv-button-color: var(
        --acv-button-inverted-color,
        var(--acv-color-button-inversed)
      );
      --_acv-button-background-color-hover: var(
        --acv-button-inverted-background-color-hover,
        var(--acv-color-button-hover-inversed)
      );
      --_acv-button-background-color-active: var(
        --acv-button-inverted-background-color-active,
        var(--acv-color-button-active-inversed)
      );
      --_acv-button-background-color-disabled: var(
        --acv-button-inverted-background-color-disabled,
        var(--acv-color-button-disabled-inversed)
      );
      --_acv-button-text-color-hover: var(
        --acv-button-inverted-text-color-hover,
        var(--acv-color-button-label-inversed-primary)
      );
      --_acv-button-text-color-active: var(
        --acv-button-inverted-text-color-active,
        var(--acv-color-button-label-inversed-primary)
      );
      --_acv-button-text-color-disabled: var(
        --acv-button-inverted-text-color-disabled,
        var(--acv-color-button-label-disabled-inversed)
      );
      --_acv-button-border-color-hover: var(
        --acv-button-inverted-border-color-hover,
        var(--acv-color-button-hover-inversed)
      );
      --_acv-button-border-color-active: var(
        --acv-button-inverted-border-color-active,
        var(--acv-color-button-active-inversed)
      );
      --_acv-button-border-color-disabled: var(
        --acv-button-inverted-border-color-disabled,
        var(--acv-color-button-disabled-inversed)
      );
      background-color: var(
        --acv-button-inverted-background-color,
        var(--acv-color-button-inversed)
      );
      color: var(
        --acv-button-inverted-text-color,
        var(--acv-color-button-label-inversed-primary)
      );
      border-color: var(
        --acv-button-secondary-border-color,
        var(--_acv-button-color)
      );
    }

    /* Need to use some hardcoded colors as danger var colors are inconsistent */
    &.acv-button_variant_status {
      --_acv-button-color: var(
        --acv-button-status-color,
        hsl(0deg 81% 57%)
      );
      --_acv-button-background-color-hover: var(
        --acv-button-status-background-color-hover,
        hsl(0deg 65% 51%)
      );
      --_acv-button-background-color-active: var(
        --acv-button-status-background-color-active,
        hsl(0deg 81% 45%)
      );
      --_acv-button-background-color-disabled: var(
        --acv-button-status-background-color-disabled,
        hsla(0deg 4% 35% / 0.3)
      );
      --_acv-button-text-color-hover: var(
        --acv-button-status-text-color-hover,
        var(--acv-color-button-label-inversed-primary)
      );
      --_acv-button-text-color-active: var(
        --acv-button-status-text-color-active,
        var(--acv-color-button-label-inversed-primary)
      );
      --_acv-button-text-color-disabled: var(
        --acv-button-status-text-color-disabled,
        var(--acv-color-button-label-disabled-inversed)
      );
      --_acv-button-border-color-hover: var(
        --acv-button-status-border-color-hover,
        hsl(0deg 65% 51%)
      );
      --_acv-button-border-color-active: var(
        --acv-button-status-border-color-active,
        hsl(0deg 81% 45%)
      );
      --_acv-button-border-color-disabled: var(
        --acv-button-status-border-color-disabled,
        hsla(0deg 4% 35% / 0.3)
      );
      background-color: var(
        --acv-button-status-background-color,
        var(--_acv-button-color)
      );
      color: var(
        --acv-button-status-text-color,
        var(--acv-color-button-label-inversed-primary)
      );
      border-color: var(
        --acv-button-status-border-color,
        var(--_acv-button-color)
      );
    }

    &.acv-button_loading {
      cursor: default;
    }

    /* States */

    &:hover:not(.acv-button_disabled, .acv-button_loading),
    &.acv-button_hover:not(.acv-button_disabled, .acv-button_loading) {
      background-color: var(--_acv-button-background-color-hover);
      color: var(--_acv-button-text-color-hover);
      border-color: var(--_acv-button-border-color-hover);
      cursor: pointer;
    }

    &:active,
    &.acv-button_active {
     transform: translateY(1px);
    }

    &:active,
    &.acv-button_active,
    &.acv-button_selected {
      background-color: var(--_acv-button-background-color-active);
      color: var(--_acv-button-text-color-active);
      border-color: var(--_acv-button-border-color-active);
    }

    &:focus-visible,
    &.acv-button_focus {
      /* TODO: make global variable for outline */
      outline: var(--acv-border-x-large)
        var(--acv-border-style-solid) var(--acv-color-button-focus);
    }

    &:disabled,
    &[disabled],
    &.acv-button_disabled {
      background-color: var(--_acv-button-background-color-disabled);
      color: var(--_acv-button-text-color-disabled);
      cursor: not-allowed;
      pointer-events: none;
      opacity: 0.5;
      box-shadow: none;
      border-color: var(--_acv-button-border-color-disabled);
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
