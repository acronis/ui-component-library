<script setup lang="ts">
  import { computed } from 'vue';
  import type {
    AcvFormLabelProps,
    AcvFormLabelSlots
  } from './formLabel.ts';
  import './formLabel.css';

  const { label } = defineProps<AcvFormLabelProps>();

  defineSlots<AcvFormLabelSlots>();

  const labelClasses = computed(() => {
    return {
      'acv-form-label': true
    };
  });
</script>

<template>
  <label :class="labelClasses">
    <slot name="label">
      <span
        v-if="label"
      >
        {{ label }}
      </span>
    </slot>

    <slot />
  </label>
</template>

<style scoped>
  .acv-form-label {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-form-label-color);
  }
</style>
