<script setup>
  import { ref } from 'vue';

  import options from '../__data__/data.mock.cascader.options.json';
  import AcvCascader from '@/components/cascader/cascader.vue';

  const valueOne = ref('');

  function handleChange(value) {
    console.log('Change event fired');
    console.log(value);
  }

  function handleSelect(value, label, path) {
    console.log('Select event fired');
    console.log(`${value},${label},${path}`);
  }
</script>

<template>
  <AcvCascader
    v-model="valueOne"
    :options="options"
    @change="handleChange"
    @select="handleSelect"
  />
</template>
