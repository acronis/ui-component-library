<script setup lang="ts">
  import type {
    AcvFormItemEvents,
    AcvFormItemProps,
    AcvFormItemSlots
  } from './formItem.ts';
  import './formItem.css';

  const { title, description } = defineProps<AcvFormItemProps>();

  defineEmits<AcvFormItemEvents>();
  defineSlots<AcvFormItemSlots>();
</script>

<template>
  <div class="acv-form-item">
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
  .acv-form-item {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-form-item-color);
  }
</style>
