<script setup>
  import AcvMarkdownEditor from '@/components/markdown-editor/markdownEditor.vue';
  import { ref } from 'vue';

  const value = ref('test');
</script>

<template>
  <AcvMarkdownEditor v-model="value" />
</template>
