<script setup lang="ts">
  import type {
    AcvDisclosureEvents,
    AcvDisclosureProps,
    AcvDisclosureSlots
  } from './disclosure.ts';
  import './disclosure.css';

  const { title, description } = defineProps<AcvDisclosureProps>();

  defineEmits<AcvDisclosureEvents>();
  defineSlots<AcvDisclosureSlots>();
</script>

<template>
  <div class="acv-disclosure">
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
  .acv-disclosure {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-disclosure-color);
  }
</style>
