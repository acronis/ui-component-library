<script setup lang="ts">
  import type {
    AcvTagEvents,
    AcvTagProps,
    AcvTagSlots
  } from './tag.ts';
  import { computed } from 'vue';
  import './tag.css';

  const props = defineProps<AcvTagProps>();

  defineEmits<AcvTagEvents>();
  defineSlots<AcvTagSlots>();

  const tagClasses = computed(() => {
    return {
      'acv-tag': true,
      'small': props.small,
    };
  });
</script>

<template>
  <div :class="tagClasses">
    <slot>{{ props.title }}</slot>
  </div>
</template>

<style scoped>
  .acv-tag {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-tag-color);
    border:1px solid var(--acv-tag-border-color);
    background-color: var(--acv-tag-background-color);
    border-radius: 12px;
    padding-inline: var(--acv-tag-padding);
    font-size: var(--acv-tag-font-size);
    line-height: var(--acv-tag-height);
    display: inline-block;

    &.small {
      --acv-tag-font-size: var(--acv-font-size-note);
      --acv-tag-padding: var(--acv-spacing-x-small);
      --acv-tag-height: 16px;
    }
  }
</style>
