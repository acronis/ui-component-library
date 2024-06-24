<script setup lang="ts">
  import type {
    AcvSwitchEvents,
    AcvSwitchProps,
    AcvSwitchSlots
  } from './switch.ts';
  import './switch.css';

  const { title, description } = defineProps<AcvSwitchProps>();

  defineEmits<AcvSwitchEvents>();
  defineSlots<AcvSwitchSlots>();
</script>

<template>
  <div class="acv-switch">
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
  .acv-switch {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-switch-color);
  }
</style>
