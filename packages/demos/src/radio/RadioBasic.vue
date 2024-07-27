<script setup>
  import { ref } from 'vue';
  import AcvRadio from '@/components/radio/radio.vue';
  import AcvFormItem from '@/components/form-item/formItem.vue';

  const picked = ref('apple');
</script>

<template>
  <AcvFormItem
    v-model="picked"
    :control="AcvRadio"
    label="🍎 Apple"
    value="apple"
  />
  <AcvFormItem
    v-model="picked"
    :control="AcvRadio"
    label="🍌 Banana"
    value="banana"
  />
  <AcvFormItem
    v-model="picked"
    :control="AcvRadio"
    label="🍇 Grape"
    value="grape"
  />
  <AcvFormItem
    v-model="picked"
    :control="AcvRadio"
    label="🍊 Orange"
    value="orange"
    disabled
  />
</template>
