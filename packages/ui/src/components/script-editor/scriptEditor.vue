<script setup lang="ts">
  import type {
    AcvScriptEditorEvents,
    AcvScriptEditorProps,
    AcvScriptEditorSlots
  } from './scriptEditor.ts';
  import './scriptEditor.css';

  const { title, description } = defineProps<AcvScriptEditorProps>();

  defineEmits<AcvScriptEditorEvents>();
  defineSlots<AcvScriptEditorSlots>();
</script>

<template>
  <div class="acv-script-editor">
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
  .acv-script-editor {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-script-editor-color);
  }
</style>
