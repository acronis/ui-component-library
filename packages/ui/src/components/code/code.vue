<script setup lang="ts">
  import { highlightText } from './highlightjs.ts';

  import type { CodeEvents, CodeProps } from './code';
  import './code.css';

  const { code } = defineProps<CodeProps>();

  defineEmits<CodeEvents>();
</script>

<template>
  <code
    class="acv-code"
    v-html="code && highlightText(code)"
  ></code>
</template>

<style scoped lang="scss">
  @import '../../styles/mixins/typography.scss';

  .acv-code {
    display: block;
    overflow: auto;
    flex-grow: 1;
    padding: var(--acv-code-padding);
    background-color: var(--acv-code-background-color);
    font-family: var(--acv-font-family-mono);
    white-space: pre;

    @include text-regular;
  }
</style>
