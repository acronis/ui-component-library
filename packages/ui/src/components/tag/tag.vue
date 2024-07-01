<script setup lang="ts">
  import type {
    AcvTagEvents,
    AcvTagProps,
    AcvTagSlots
  } from './tag.ts';
  import './tag.css';

  const { title, description } = defineProps<AcvTagProps>();

  defineEmits<AcvTagEvents>();
  defineSlots<AcvTagSlots>();
</script>

<template>
  <div class="acv-tag">
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
  .acv-tag {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-tag-color);
  }
</style>
