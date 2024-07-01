<script setup lang="ts">
  import type {
    AcvFormErrorEvents,
    AcvFormErrorProps,
    AcvFormErrorSlots
  } from './formError.ts';
  import './formError.css';

  const { title, description } = defineProps<AcvFormErrorProps>();

  defineEmits<AcvFormErrorEvents>();
  defineSlots<AcvFormErrorSlots>();
</script>

<template>
  <div class="acv-form-error">
    <slot>{{ title }}</slot>
    <slot
      name="description"
      :description="description"
    >
      {{ description }}
    </slot>
  </div>
</template>

<style scoped>
  .acv-form-error {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-form-error-color);
  }
</style>
