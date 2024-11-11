<script setup lang="ts">
  import type {
    AcvCascaderEvents,
    AcvCascaderProps,
    AcvCascaderSlots
  } from '@/components/__todo__/cascader/cascader.ts';
  import '@/components/__todo__/cascader/cascader.css';

  const { title, description } = defineProps<AcvCascaderProps>();

  defineEmits<AcvCascaderEvents>();
  defineSlots<AcvCascaderSlots>();
</script>

<template>
  <div class="acv-cascader">
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
  .acv-cascader {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-cascader-color);
  }
</style>
