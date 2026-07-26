<script setup lang="ts">
  import type {
    AcvFileUploadEvents,
    AcvFileUploadProps,
    AcvFileUploadSlots
  } from './fileUpload.ts';
  import './fileUpload.css';

  const { title, description } = defineProps<AcvFileUploadProps>();

  defineEmits<AcvFileUploadEvents>();
  defineSlots<AcvFileUploadSlots>();
</script>

<template>
  <div class="acv-file-upload">
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
  .acv-file-upload {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-file-upload-color);
  }
</style>
