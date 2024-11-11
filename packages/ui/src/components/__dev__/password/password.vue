<script setup lang="ts">
  import type {
    AcvPasswordEvents,
    AcvPasswordProps,
    AcvPasswordSlots
  } from '@/components/__dev__/password/password.ts';
  import '@/components/__dev__/password/password.css';

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
