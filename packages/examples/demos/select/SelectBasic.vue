<script setup>
  import AcvSelect from '@/components/select/select.vue';
  import { ref } from 'vue';
  import { generateTenOptions } from '../../__mocks__/data.select.generateOptions.js';

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
