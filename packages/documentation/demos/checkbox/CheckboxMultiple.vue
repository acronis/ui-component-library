<script setup lang="ts">
  import { ref } from 'vue';

  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';
  import AcvTypography from '@/components/typography/typography.vue';

  const checkedNames = ref<string[]>([]);
</script>

<template>
  <AcvTypography cs="flex-basis: 100%; text-align: center;">
    {{ checkedNames }}
  </AcvTypography>
  <AcvFormItem
    v-model="checkedNames"
    :control="AcvCheckbox"
    label="Jack"
    value="Jack"
  />
  <AcvFormItem
    v-model="checkedNames"
    :control="AcvCheckbox"
    label="John"
    value="John"
  />
  <AcvFormItem
    v-model="checkedNames"
    :control="AcvCheckbox"
    label="Mike"
    value="Mike"
  />
</template>
