<script setup>
  import AcvRadio from '@/components/radio/radio.vue';
  import { ref } from 'vue';

  const picked = ref(true);
</script>

<template>
  <AcvRadio
    v-model="picked"
    label="Disabled and checked"
    :value="true"
    disabled
  />
  <AcvRadio
    v-model="picked"
    label="Disabled and unchecked"
    :value="false"
    disabled
  />
</template>
