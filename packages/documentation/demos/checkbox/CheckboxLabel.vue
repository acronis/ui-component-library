<script setup lang="ts">
  import { reactive } from 'vue';
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';

  const checked = reactive<boolean[]>([true, true, true]);
</script>

<template>
  <AcvFormItem
    v-model="checked[0]"
    :control="AcvCheckbox"
    label="Label"
  />
  <AcvFormItem
    v-model="checked[1]"
    :control="AcvCheckbox"
    label="Required"
    required
  />
  <AcvFormItem
    v-model="checked[2]"
    :control="AcvCheckbox"
    label="Disabled"
    disabled
  />
</template>
