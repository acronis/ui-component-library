<script setup lang="ts">
  import type { AcvCodeEvents, AcvCodeProps } from '@/components/__dev__/code/code.ts';

  import { highlightText } from '@/components/__dev__/code/highlightjs.ts';
  import '@/components/__dev__/code/code.css';

  const { code } = defineProps<AcvCodeProps>();

  defineEmits<AcvCodeEvents>();
</script>

<template>
  <code
    class="acv-code"
    v-html="code && highlightText(code)"
  />
</template>

<style scoped>
  .acv-code {
    display: block;
    overflow: auto;
    flex-grow: 1;
    padding: var(--acv-code-padding);
    background-color: var(--acv-code-background-color);
    font-family: var(--acv-font-family-mono);
    white-space: pre;

    /* text-regular */
    font-size: var(--acv-font-size-body);
    font-weight: var(--acv-font-weight-regular);
    line-height: var(--acv-font-line-height-small);
  }
</style>
