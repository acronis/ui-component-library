<script setup>
  import { ref } from 'vue';

  const value = ref([1, 2, 'last']);
  const numItems = 3;
  const pickerOptions = {
    customOptions: [
      { key: 'first', label: 'First Day' },
      { key: 'last', label: 'Last Day' }
    ],
    customOptionSelectAll: 'All days'
  };
</script>

<template>
  <acv-date-picker
    v-for="(i) in numItems"
    :key="i"
    v-model="value"
    type="multi"
    placeholder="Multi select"
    :picker-options="pickerOptions"
    label="Days"
  />
</template>
