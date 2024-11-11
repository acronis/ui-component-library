<script setup>
  import Combobox from '@/components/combobox/combobox.vue';
  import { ref } from 'vue';

  const value = ref('Acronis');
  const options = ['Acronis', 'Parallels', 'Virtuozzo', 'Google', 'Apple', 'Microsoft'];
  const minutes = [10, 20, 30, 40, 50, 60];
  const passwords = {
    Acronis: 'qwe123',
    Parallels: 'admin',
    Virtuozzo: 'qwerty',
    Google: '1234567890',
    Apple: '1q2w3e',
    Microsoft: '11111111'
  };
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
    type="password"
    placeholder="Select an option"
    size="small"
  >
    <Option
      v-for="(password, key) in passwords"
      :key="password"
      :label="password"
      :value="password"
    >
      {{ key }}
    </Option>
  </Combobox>
  <Combobox
    v-model="value"
    min="1"
    max="999"
    type="number"
    placeholder="Select an option"
    size="small"
  >
    <Option
      v-for="item in minutes"
      :key="item"
      :label="item"
      :value="item"
    />
  </Combobox>
</template>
