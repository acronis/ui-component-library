<script setup lang="ts">
  import type {
    AcvPasswordEvents,
    AcvPasswordProps,
    AcvPasswordSlots
  } from './password.ts';
  import './password.css';

  const { title, description } = defineProps<AcvPasswordProps>();

  defineEmits<AcvPasswordEvents>();
  defineSlots<AcvPasswordSlots>();
</script>

<template>
  <div class="acv-password">
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
  .acv-password {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-password-color);
  }
</style>
