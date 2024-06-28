<script lang="ts" setup>
  import './link.css';
  import type { LinkProps } from './link.ts';

  const { title } = defineProps<LinkProps>();
  defineEmits<{
    close: []
  }>();
</script>

<template>
  <div class="acv-link">
    <slot>{{ title }}</slot>
  </div>
</template>

<style scoped>
  .acv-link {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-link-color);
    cursor: pointer;
  }
</style>
