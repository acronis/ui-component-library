<script setup>
  import { ref } from 'vue';
  import AcvRadio from '@/components/radio/radio.vue';

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
