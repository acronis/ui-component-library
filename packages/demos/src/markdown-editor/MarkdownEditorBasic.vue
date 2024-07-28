<script setup>
  import { ref } from 'vue';
  import AcvMarkdownEditor from '@/components/markdown-editor/markdownEditor.vue';

  const value = ref('test');
</script>

<template>
  <AcvMarkdownEditor v-model="value" />
</template>
