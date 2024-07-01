<script lang="ts" setup>
  import { computed } from 'vue';
  import './card.css';
  import type { CardProps } from './card.ts';

  const { backgroundColor, borderColor } = defineProps<CardProps>();
  defineEmits<{
    close: []
  }>();
  const classes = computed(() => {
    return {
      [`acv-card-background-${backgroundColor}`]: backgroundColor,
      [`acv-card-border-${backgroundColor}`]: borderColor
    };
  });
</script>

<template>
  <div
    class="acv-card"
    :class="classes"
  >
    <slot />
  </div>
</template>

<style scoped>
  .acv-card {
    font-weight: var(--acv-font-weight-strong);
    border-width: var(--acv-border-regular);
    border-style: var(--acv-border-style-solid);
    border-radius: var(--acv-radius-regular);
    border-color: var(--acv-card-border-color);
    background-color: var(--acv-card-background-color);
    background-clip: padding-box;
    overflow: hidden;
    color: var(--acv-card-color);
    font-size: var(--acv-font-size-body);
  }

  .acv-card--modal {
    box-shadow: var(--acv-shadow-modal);
    border: none;
  }

  .acv-card-background-white {
    background-color: var(--acv-color-white);
  }

  .acv-card-border-brand {
    background-color: var(--acv-color-brand-primary);
  }

  .acv-card-border-success {
    background-color: var(--acv-color-status-success-secondary);
  }

  .acv-card-border-warning {
    background-color: var(--acv-color-status-warning-secondary);
  }

  .acv-card-border-danger {
    background-color: var(--acv-color-status-danger-secondary);
  }
</style>
