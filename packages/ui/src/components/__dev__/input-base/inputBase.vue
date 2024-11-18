<script setup lang="ts">
  import type {
    AcvInputBaseEvents,
    AcvInputBaseProps
  } from '@/components/__dev__/input-base/inputBase.ts';
  import { computed } from 'vue';
  import '@/components/__dev__/input-base/inputBase.css';

  const { type, hidden } = defineProps<AcvInputBaseProps>();

  defineEmits<AcvInputBaseEvents>();
  const value = defineModel();

  const inputBaseClasses = computed(() => ({
    'acv-input-base': true,
    'hidden': hidden
  }));
</script>

<template>
  <input
    v-bind="$attrs"
    v-model="value"
    :type="type"
    :class="inputBaseClasses"
  >
</template>

<style scoped>
  .acv-input-base {
    background: none;
    color: inherit;

    &.hidden {
        cursor: inherit;
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        z-index: var(--acv-z-index-normal);
    }
  }
</style>
