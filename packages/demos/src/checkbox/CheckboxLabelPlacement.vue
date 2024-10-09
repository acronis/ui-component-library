<script setup>
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';
  import { reactive } from 'vue';

  const checked = reactive([true, true, true, true]);
</script>

<template>
  <AcvFormItem
    v-model="checked[0]"
    :control="AcvCheckbox"
    label="Top"
    label-placement="top"
  />
  <AcvFormItem
    v-model="checked[1]"
    :control="AcvCheckbox"
    label="Left"
    label-placement="left"
  />
  <AcvFormItem
    v-model="checked[2]"
    :control="AcvCheckbox"
    label="Bottom"
    label-placement="bottom"
  />
  <AcvFormItem
    v-model="checked[3]"
    :control="AcvCheckbox"
    label="Right"
    label-placement="right"
  />
</template>
