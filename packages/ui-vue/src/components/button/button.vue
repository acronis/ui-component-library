<script setup lang="ts">
  import type { AcvButtonProps } from './button.ts';
  import AcvIcon from '@/components/icon/icon.vue';
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
      [`acv-button_variant_${variant}`]: true,
      [`acv-button_size_${size}`]: true,
      'acv-button_disabled': isDisabled,
      'acv-button_selected': selected,
      'acv-button_loading': loading,
    }"
    @click.capture="handleClick"
  >
    <template v-if="$slots.prepend">
      <!-- @slot Left side slot content. Usually for icon -->
      <slot name="prepend" />
    </template>
    <template v-if="props.icon">
      <AcvIcon
        :source="typeof props.icon === 'function' ? props.icon : undefined"
        :name="typeof props.icon === 'string' ? props.icon : undefined"
        :size="size"
      />
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
    border-radius: var(--acv-radius-regular);
    border-style: solid;
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
      gap: var(--acv-spacing-x-small);
      min-inline-size: 24px;
      padding-inline: var(--acv-spacing-x-small);
      block-size: var(--acv-height-small);
      font-size: var(--acv-font-size-caption);
    }

    &.acv-button_size_medium {
      --acv-icon-size: var(--acv-icon-size-x-small);
      gap: var(--acv-spacing-small);
      min-inline-size: 32px;
      padding-inline: var(--acv-spacing-small);
      font-size: var(--acv-font-size-body);
      block-size: var(--acv-height-regular);
    }

    &.acv-button_size_large {
      --acv-icon-size: var(--acv-icon-size-medium);

      /* TODO: make spinner = icon and remove it from here */
      --acv-spinner-size: var(--acv-spinner-size-large);
      gap: var(--acv-spacing-regular);
      min-inline-size: 48px;
      padding-inline: var(--acv-spacing-regular);
      font-size: var(--acv-font-size-lead);
      block-size: var(--acv-height-x-large);
    }

    /* Button variants */
    &.acv-button_variant_primary {
      --_acv-button-background-color-hover: var(--acv-color-button-hover-primary);
      --_acv-button-background-color-active: var(--acv-color-button-active-primary);
      --_acv-button-background-color-disabled: var(--acv-color-button-disabled);
      --_acv-button-text-color-hover: var(--acv-color-button-label-inversed-primary);
      --_acv-button-text-color-active: var(--acv-color-button-label-inversed-primary);
      --_acv-button-text-color-disabled: var(--acv-color-button-label-disabled-inversed);
      --_acv-button-border-color-hover: var(--acv-color-button-hover-primary);
      --_acv-button-border-color-active: var(--acv-color-button-active-primary);
      --_acv-button-border-color-disabled: var(--acv-color-button-disabled);
      background-color: var(--acv-color-button-primary);
      border-color: var(--acv-color-button-primary);
      color: var(--acv-color-button-label-inversed-primary);
    }

    &.acv-button_variant_secondary {
      --_acv-button-background-color-hover: var(--acv-color-button-hover-secondary);
      --_acv-button-background-color-active: var(--acv-color-button-active-secondary);
      --_acv-button-background-color-disabled: var(--acv-color-button-disabled-inversed);
      --_acv-button-text-color-hover: var(--acv-color-button-label-primary);
      --_acv-button-text-color-active: var(--acv-color-button-label-primary);
      --_acv-button-text-color-disabled: var(--acv-color-button-label-disabled);
      --_acv-button-border-color-hover: var(--acv-color-button-hover-primary);
      --_acv-button-border-color-active: var(--acv-color-button-hover-primary);
      --_acv-button-border-color-disabled: var(--acv-color-button-disabled);
      background-color: var(--acv-color-transparent);
      border-color: var(--acv-color-button-secondary);
      color: var(--acv-color-button-secondary);
    }

    &.acv-button_variant_ghost {
      --_acv-button-background-color-hover: var(--acv-color-button-hover-secondary);
      --_acv-button-background-color-active: var(--acv-color-button-active-secondary);
      --_acv-button-background-color-disabled: var(--acv-color-button-disabled-inversed);
      --_acv-button-text-color-hover: var(--acv-color-button-label-primary);
      --_acv-button-text-color-active: var(--acv-color-button-label-primary);
      --_acv-button-text-color-disabled: var(--acv-color-button-label-disabled);
      --_acv-button-border-color-hover: var(--acv-color-button-hover-secondary);
      --_acv-button-border-color-active: var(--acv-color-button-active-secondary);
      --_acv-button-border-color-disabled: var(--acv-color-transparent);
      background-color: var(--acv-color-transparent);
      border-color: var(--acv-color-transparent);
      color: var(--acv-color-button-secondary);
    }

    &.acv-button_variant_inverted {
      --_acv-button-background-color-hover: var(--acv-color-button-hover-inversed);
      --_acv-button-background-color-active: var(--acv-color-button-active-inversed);
      --_acv-button-background-color-disabled: var(--acv-color-button-disabled-inversed);
      --_acv-button-text-color-hover: var(--acv-color-button-label-inversed-primary);
      --_acv-button-text-color-active: var(--acv-color-button-label-inversed-primary);
      --_acv-button-text-color-disabled: var(--acv-color-button-label-disabled-inversed);
      --_acv-button-border-color-hover: var(--acv-color-button-hover-inversed);
      --_acv-button-border-color-active: var(--acv-color-button-active-inversed);
      --_acv-button-border-color-disabled: var(--acv-color-button-disabled-inversed);
      background-color: var(--acv-color-button-inversed);
      border-color: var(--acv-color-button-inversed);
      color: var(--acv-color-button-label-inversed-primary);
    }

    /* Need to use some hardcoded colors as danger var colors are inconsistent */
    &.acv-button_variant_status {
      --_acv-button-background-color-hover: var(--acv-color-button-hover-danger);
      --_acv-button-background-color-active: var(--acv-color-button-active-danger);
      --_acv-button-background-color-disabled: var(--acv-color-button-disabled-danger);
      --_acv-button-text-color-hover: var(--acv-color-button-label-inversed-primary);
      --_acv-button-text-color-active: var(--acv-color-button-label-inversed-primary);
      --_acv-button-text-color-disabled: var(--acv-color-button-label-disabled-inversed);
      --_acv-button-border-color-hover: var(--acv-color-button-hover-danger);
      --_acv-button-border-color-active: var(--acv-color-button-active-danger);
      --_acv-button-border-color-disabled: var(--acv-color-button-disabled-danger);
      background-color: var(--acv-color-button-danger);
      border-color: var(--acv-color-button-danger);
      color: var(--acv-color-button-label-inversed-primary);
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
