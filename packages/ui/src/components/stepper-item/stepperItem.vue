<script setup lang="ts">
  import type {
    AcvStepperItemEvents,
    AcvStepperItemProps,
    AcvStepperItemSlots
  } from './stepperItem.ts';
  import { computed } from 'vue';

  const props = withDefaults(defineProps<AcvStepperItemProps>(), {
    is: 'button',
  });

  const emit = defineEmits<AcvStepperItemEvents>();
  defineSlots<AcvStepperItemSlots>();

  const isClickable = computed(() => !props.disabled);

  /**
   * Disable click if component is link. Use "capture" to prevent RouterLink click
   */
  function checkDisabled(event: MouseEvent) {
    if (!isClickable.value && event.target instanceof HTMLAnchorElement) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  function onClick() {
    if (isClickable.value) {
      emit('select');
    }
  }
</script>

<template>
  <Component
    :is="is"
    :to="to"
    class="acv-stepper-item"
    :type="is === 'button' ? 'button' : undefined"
    :role="is !== 'button' ? 'button' : undefined"
    :class="[selected && 'acv-stepper-item_selected', disabled && 'acv-stepper-item_disabled']"
    :tabindex="isClickable ? 0 : -1"
    @click.capture="checkDisabled"
    @click="onClick"
  >
    <slot />
  </Component>
</template>

<style scoped>
  .acv-stepper-item {
    font-family: var(--acv-font-family-default);
    font-weight: var(--acv-font-weight-strong);
    font-size: var(--acv-font-size-caption);
    padding-inline: var(--acv-spacing-md);
    block-size: var(--acv-size-64px);
    background-color: var(--acv-color-transparent);
    border-bottom-style: solid;
    border-bottom-width: var(--acv-border-regular);
    border-color: hsl(215deg 68% 46% / 0.1);
    color: var(--acv-color-button-secondary);

    /* TODO: transition css variable */
    transition: all 250ms;

    &:hover:not(.acv-stepper-item_disabled) {
      background-color: var(--acv-color-button-hover-secondary);
    }

    &:active,
    &.acv-stepper-item_selected {
      background-color: var(--acv-color-secondary-lightest);
      color: var(--acv-color-text-primary);

      /* TODO: use css variable */
      border-color: hsl(215deg 68% 46% / 0.1);
    }

    &:focus-visible {
      background-color: var(--acv-color-button-focus);
    }

    &.acv-stepper-item_disabled {
      background-color: var(--acv-color-button-disabled-inversed);
      color: var(--acv-color-text-secondary);
      cursor: not-allowed;

      /* TODO: use css variable */
      border-color: hsl(215deg 68% 46% / 0.1);
    }
  }
</style>
