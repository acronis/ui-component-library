<script setup lang="ts">
  import type {
    AcvUploadEvents,
    AcvUploadProps,
    AcvUploadSlots
  } from '@/components/__todo__/upload/upload.ts';
  import '@/components/__todo__/upload/upload.css';

  const { title, description } = defineProps<AcvUploadProps>();

  defineEmits<AcvUploadEvents>();
  defineSlots<AcvUploadSlots>();
</script>

<template>
  <div class="acv-upload">
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
  .acv-upload {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-upload-color);
  }
</style>
