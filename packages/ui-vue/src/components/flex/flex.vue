<script setup lang="ts">
  import type { AcvFlexProps } from './flex.ts';
  import './flex.css';

  const { title, description } = defineProps<AcvFlexProps>();

  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();
</script>

<template>
  <div class="acv-flex">
    <slot>{{ title }}</slot>
    <slot name="description">
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-flex {
    font-weight: var(--acv-font-weight-strong);
  }
</style>
