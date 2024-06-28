<script setup lang="ts">
  import './input.css';
  import type { InputProps } from './input.ts';

  const { trueValue, falseValue } = defineProps<InputProps>();
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
  />
</template>

<style scoped>
  .acv-input {
    background: none;
    color: inherit;
  }
</style>
