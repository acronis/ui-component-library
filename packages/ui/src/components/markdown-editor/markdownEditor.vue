<script setup lang="ts">
  import type { ToolbarNames } from 'md-editor-v3';
  import { MdEditor } from 'md-editor-v3';
  import type {
    AcvMarkdownEditorEvents,
    AcvMarkdownEditorProps,
    AcvMarkdownEditorSlots
  } from './markdownEditor.ts';
  import './markdownEditor.css';
  import 'md-editor-v3/lib/style.css';

  defineOptions({ name: 'AcvMarkdownEditor' });

  defineProps<AcvMarkdownEditorProps>();

  defineEmits<AcvMarkdownEditorEvents>();

  defineSlots<AcvMarkdownEditorSlots>();

  const model = defineModel<string>();
  const toolbars: ToolbarNames[] = ['bold', 'italic', 'underline', '-', 'title', '-', 'orderedList', 'unorderedList', '-', 'link', 'image', 'table', 'code'];
</script>

<template>
  <div class="acv-markdown-editor">
    <MdEditor
      v-model="model"
      language="en-US"
      :toolbars="toolbars"
      :preview="false"
    />
  </div>
</template>

<style scoped>
  .acv-markdown-editor {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-markdown-editor-color);
  }
</style>
