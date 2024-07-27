<script setup>
  import { reactive } from 'vue';
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';

  const checked = reactive([true, true, true]);
</script>

<template>
  <AcvCheckbox
    v-model="checked[0]"
    size="small"
    label="Small"
  />
  <AcvCheckbox
    v-model="checked[1]"
    label="Default"
  />
  <AcvCheckbox
    v-model="checked[2]"
    size="large"
    label="Large"
  />
</template>
