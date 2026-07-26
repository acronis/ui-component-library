<script setup lang="ts">
  import type { AcvInputProps } from './input.ts';
  import './input.css';

  const { trueValue, falseValue } = defineProps<AcvInputProps>();
  defineEmits<{
    /**
     * Triggered when the component is closed
     * @arg {string} payload - The first argument
     */
    close: []
  }>();

  const value = defineModel();
</script>

<template>
  <input
    v-model="value"
    :true-value="trueValue"
    :false-value="falseValue"
    class="acv-input"
    :type="$props.type"
  >
</template>

<style scoped>
  .acv-input {
    background: none;
    color: inherit;
  }
</style>
