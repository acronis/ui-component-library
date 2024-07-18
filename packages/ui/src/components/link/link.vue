<script lang="ts" setup>
  import './link.css';
  import { computed } from 'vue';
  import type { AcvLinkProps, AcvLinkSlots } from './link.ts';

  const { disabled } = defineProps<AcvLinkProps>();
  defineEmits<{
    close: []
  }>();
  defineSlots<AcvLinkSlots>();
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
    line-height: var(--acv-font-line-height-regular);
    font-size: var(--acv-font-size-body);
    color: var(--acv-link-color);
    cursor: pointer;

    &.disabled {
      --acv-link-color: var(--acv-color-link-disabled);
      pointer-events: none;

      &.inversed {
        --acv-link-color: var(--acv-color-link-disabled-inversed);
      }
    }

    &.inversed {
      --acv-link-color: var(--acv-color-link-inversed-primary);
    }

    &:hover {
      --acv-link-color: var(--acv-color-link-hover);
    }

    &:visited {
      --acv-link-color: var(--acv-link-color-visited);
    }

    &:active {
      --acv-link-color: var(--acv-color-link-active);
    }

    &:focus-visible,
    &.focus {
      outline: var(--acv-button-focus-outline);
    }
  }
</style>
