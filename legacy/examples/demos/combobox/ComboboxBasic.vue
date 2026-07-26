<script setup>
  import Combobox from '@/components/combobox/combobox.vue';
  import { ref } from 'vue';

  const value = ref('Acronis');
  const options = ['Acronis', 'Parallels', 'Virtuozzo', 'Google', 'Apple', 'Microsoft'];
</script>

<template>
  <Combobox
    v-model="value"
    :options="options"
    placeholder="Select an option"
  >
    <Option
      v-for="item in options"
      :key="item"
      :label="item"
      :value="item"
    />
  </Combobox>
</template>
