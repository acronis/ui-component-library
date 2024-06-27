<script setup lang="ts">
  import type {
    AcvBaseInputEvents,
    AcvBaseInputProps,
    AcvBaseInputSlots
  } from './baseInput.ts';
  import './baseInput.css';

  const { title, description } = defineProps<AcvBaseInputProps>();

  defineEmits<AcvBaseInputEvents>();
  defineSlots<AcvBaseInputSlots>();
</script>

<template>
  <div class="acv-base-input">
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
  .acv-base-input {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-base-input-color);
  }
</style>
