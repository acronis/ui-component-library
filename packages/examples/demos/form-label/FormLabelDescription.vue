<script setup>
  import FormLabel from '@/components/form-label/formLabel.vue';
  import AcvSelect from '@/components/select/select.vue';
  import { generateTenOptions } from '../../__mocks__/data.select.generateOptions.js';

  const { options, value } = generateTenOptions()();
</script>

<template>
  <FormLabel
    label="Test label"
    description="Description"
    placement="top"
  >
    <AcvSelect
      :options="options"
      :value="value"
    />
  </FormLabel>
</template>
