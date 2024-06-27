<script setup lang="ts">
  import type {
    AcvFileBrowserEvents,
    AcvFileBrowserProps,
    AcvFileBrowserSlots
  } from './fileBrowser.ts';
  import './fileBrowser.css';

  const { title, description } = defineProps<AcvFileBrowserProps>();

  defineEmits<AcvFileBrowserEvents>();
  defineSlots<AcvFileBrowserSlots>();
</script>

<template>
  <div class="acv-file-browser">
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
  .acv-file-browser {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-file-browser-color);
  }
</style>
