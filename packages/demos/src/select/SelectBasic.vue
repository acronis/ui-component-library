<script setup>
  import { ref } from 'vue';
  import { generateTenOptions } from '../__data__/data.select.generateOptions.js';
  import AcvSelect from '@/components/select/select.vue';

  const { options } = generateTenOptions()();
  const value = ref(options[3].value);
</script>

<template>
  <AcvSelect
    v-model="value"
    placeholder="Select option"
    :options="options"
  />
</template>
