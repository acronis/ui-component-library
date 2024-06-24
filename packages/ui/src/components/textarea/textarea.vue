<script setup lang="ts">
  import type {
    AcvTextareaEvents,
    AcvTextareaProps,
    AcvTextareaSlots
  } from './textarea.ts';
  import './textarea.css';

  const { title, description } = defineProps<AcvTextareaProps>();

  defineEmits<AcvTextareaEvents>();
  defineSlots<AcvTextareaSlots>();
</script>

<template>
  <div class="acv-textarea">
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
  .acv-textarea {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-textarea-color);
  }
</style>
