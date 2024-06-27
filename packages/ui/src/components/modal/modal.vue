<script setup lang="ts">
  import type {
    AcvModalEvents,
    AcvModalProps,
    AcvModalSlots
  } from './modal.ts';
  import './modal.css';

  const { title, description } = defineProps<AcvModalProps>();

  defineEmits<AcvModalEvents>();
  defineSlots<AcvModalSlots>();
</script>

<template>
  <div class="acv-modal">
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
  .acv-modal {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-modal-color);
  }
</style>
