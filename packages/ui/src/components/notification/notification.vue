<script setup lang="ts">
  import type {
    AcvNotificationEvents,
    AcvNotificationProps,
    AcvNotificationSlots
  } from './notification.ts';
  import './notification.css';

  const { title, description } = defineProps<AcvNotificationProps>();

  defineEmits<AcvNotificationEvents>();
  defineSlots<AcvNotificationSlots>();
</script>

<template>
  <div class="acv-notification">
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
  .acv-notification {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-notification-color);
  }
</style>
