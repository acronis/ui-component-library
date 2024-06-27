<script setup lang="ts">
  import { ref } from 'vue';
  import type {
    AcvConfirmDialogEvents,
    AcvConfirmDialogProps,
    AcvConfirmDialogSlots
  } from './confirmDialog.ts';
  import './confirmDialog.css';
  import AcvDialog from '@/components/dialog/dialog.vue';

  const { title, description } = defineProps<AcvConfirmDialogProps>();

  const emit = defineEmits<AcvConfirmDialogEvents>();

  defineSlots<AcvConfirmDialogSlots>();

  const dialogValue = ref(false);

  function onCloseDialog() {
    if (dialogValue.value.returnValue === 'cancel') {
      dialogValue.value = false;
    }
    else if (dialogValue.value.returnValue === 'confirm') {
      dialogValue.value = false;
      emit('confirm');
    }
  }
</script>

<template>
  <AcvDialog
    v-model="dialogValue"
    class="acv-confirm-dialog"
    @close="onCloseDialog"
  >
    <slot>{{ title }}</slot>
    <slot
      name="description"
      :description="description"
    >
      {{ description }}
    </slot>
    <template #footer>
      <menu>
        <button value="cancel">
          Cancel
        </button>
        <button value="confirm">
          Confirm
        </button>
      </menu>
    </template>
  </AcvDialog>
</template>

<style scoped>
  .acv-confirm-dialog {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-confirm-dialog-color);
  }
</style>
