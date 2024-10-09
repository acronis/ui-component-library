<script setup lang="ts">
  import type {
    AcvFormDialogEvents,
    AcvFormDialogProps,
    AcvFormDialogSlots
  } from './formDialog.ts';
  import AcvDialog from '../dialog/dialog.vue';
  import './formDialog.css';

  const { title, description } = defineProps<AcvFormDialogProps>();

  defineEmits<AcvFormDialogEvents>();
  defineSlots<AcvFormDialogSlots>();
</script>

<template>
  <AcvDialog class="acv-form-dialog">
    <form method="dialog">
      <slot>{{ title }}</slot>
    </form>
    <slot
      name="description"
      :description="description"
    >
      {{ description }}
    </slot>
  </AcvDialog>
</template>

<style scoped>
  .acv-form-dialog {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-form-dialog-color);
  }
</style>
