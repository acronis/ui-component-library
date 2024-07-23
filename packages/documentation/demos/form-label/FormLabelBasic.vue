<script setup>
  import { generateTenOptions } from '../__data__/data.select.generateOptions.js';
  import FormLabel from '@/components/form-label/formLabel.vue';
  import AcvSelect from '@/components/select/select.vue';

  const { options, value } = generateTenOptions()();
</script>

<template>
  <FormLabel label="Test label">
    <AcvSelect
      :options="options"
      :value="value"
    />
  </FormLabel>
</template>
