<script setup lang="ts">
  import type {
    AcvFormEvents,
    AcvFormProps,
    AcvFormSlots
  } from '@/components/__dev__/form/form.ts';
  import '@/components/__dev__/form/form.css';

  const { title, description } = defineProps<AcvFormProps>();

  defineEmits<AcvFormEvents>();
  defineSlots<AcvFormSlots>();
</script>

<template>
  <div class="acv-form">
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
  .acv-form {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-form-color);
  }
</style>
