<script setup>
  import Combobox from '@/components/combobox/combobox.vue';
  import { ref } from 'vue';
  // import Option from '@/components/combobox/option.vue';

  const value = ref('Acronis');
  const options = ['Acronis', 'Parallels', 'Virtuozzo', 'Google', 'Apple', 'Microsoft'];
</script>

<template>
  <Combobox
    v-model="value"
    placeholder="Select an option"
  >
    <Option
      v-for="item in options"
      :key="item"
      :label="item"
      :value="item"
    />
  </Combobox>
  <Combobox
    v-model="value"
    placeholder="Select an option"
    size="small"
  >
    <Option
      v-for="item in options"
      :key="item"
      :label="item"
      :value="item"
    />
  </Combobox>
</template>
