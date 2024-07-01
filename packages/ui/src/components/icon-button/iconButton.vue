<script setup lang="ts">
  import { computed } from 'vue';
  import Button from '../button/button.vue';
  import type { IconButtonEvents, IconButtonProps, IconButtonSlots } from './iconButton.ts';
  import './iconButton.css';

  const { color, size } = defineProps<IconButtonProps>();

  defineEmits<IconButtonEvents>();
  defineSlots<IconButtonSlots>();

  const classes = computed(() => {
    return {
      [`acv-icon-button-color-${color}`]: color,
      [`acv-icon-button-size-${size}`]: size,
    };
  });
</script>

<template>
  <Button
    class="acv-icon-button"
    :class="classes"
  >
    <slot />
  </Button>
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
      color: var(--acv-background-disabled);
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
