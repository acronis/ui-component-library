<script setup lang="ts">
  import type {
    AcvConfirmDialogEvents,
    AcvConfirmDialogProps,
    AcvConfirmDialogSlots
  } from './confirmDialog.ts';
  import { ref } from 'vue';
  import AcvButton from '../button/button.vue';
  import AcvDialog from '../dialog/dialog.vue';
  import './confirmDialog.css';

  const { title, description } = defineProps<AcvConfirmDialogProps>();

  const emit = defineEmits<AcvConfirmDialogEvents>();

  defineSlots<AcvConfirmDialogSlots>();

  const dialogValue = ref(false);
  const confirmDialog = ref<typeof AcvDialog | HTMLDialogElement>();

  function onCloseDialog() {
    if (confirmDialog.value?.returnValue === 'cancel') {
      dialogValue.value = false;
    }
    else if (confirmDialog.value?.returnValue === 'confirm') {
      dialogValue.value = false;
      emit('confirm');
    }
  }
</script>

<template>
  <AcvDialog
    ref="confirmDialog"
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
        <AcvButton value="cancel">
          Cancel
        </AcvButton>
        <AcvButton value="confirm">
          Confirm
        </AcvButton>
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
