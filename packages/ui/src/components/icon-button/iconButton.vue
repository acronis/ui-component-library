<script setup lang="ts">
  import { computed } from 'vue';
  import type { AcvIconButtonEvents, AcvIconButtonProps, AcvIconButtonSlots } from './iconButton.ts';
  import AcvButton from '@/components/button/button.vue';
  import './iconButton.css';

  const { color, size } = defineProps<AcvIconButtonProps>();

  defineEmits<AcvIconButtonEvents>();
  defineSlots<AcvIconButtonSlots>();

  const classes = computed(() => {
    return {
      [`acv-icon-button-color-${color}`]: color,
      [`acv-icon-button-size-${size}`]: size,
    };
  });
</script>

<template>
  <AcvButton
    class="acv-icon-button"
    :size="size"
    :class="classes"
  >
    <slot />
  </AcvButton>
</template>

<style scoped>
  .acv-icon-button {
    background-color: transparent;
    appearance: none;
    padding: 8px;
    border-radius: 50%;
    height: fit-content;
    color: var(--acv-icon-button-color);
    font-size: var(--acv-icon-button-size);

    &:hover {
      background-color: var(--acv-color-primary-light);
    }

    &[disabled] {
      background-color: transparent;
      color: var(--acv-color-disabled);
    }

    &.acv-icon-button-color-primary {
      --acv-icon-button-color: var(--acv-color-brand-primary);
    }

    &.acv-icon-button-color-secondary {
      --acv-icon-button-color: var(--acv-color-secondary);
    }

    &.acv-icon-button-color-success {
      --acv-icon-button-color: var(--acv-color-success);
    }

    &.acv-icon-button-size-small {
      --acv-icon-button-color: var(--acv-icon-button-size-small);
    }

    &.acv-icon-button-size-medium {
      --acv-icon-button-color: var(--acv-icon-button-size-medium);
    }

    &.acv-icon-button-size-large {
      --acv-icon-button-color: var(--acv-icon-button-size-large);
    }
  }
</style>
