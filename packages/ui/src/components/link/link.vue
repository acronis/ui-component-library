<script lang="ts" setup>
  import './link.css';
  import { computed } from 'vue';
  import type { AcvLinkProps } from './link.ts';

  const { disabled } = defineProps<AcvLinkProps>();
  defineEmits<{
    close: []
  }>();

  const linkClasses = computed(() => [
    'acv-link',
    { disabled }
  ]);
</script>

<template>
  <a
    :class="linkClasses"
    v-bind="$attrs"
    role="link"
  >
    <slot />
  </a>
</template>

<style scoped>
  .acv-link {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-link-color);
    cursor: pointer;

    &.disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
</style>
