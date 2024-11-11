<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDrawer from '@/components/drawer/drawer.vue';
  import { ref } from 'vue';

  const isDrawerShown = ref(false);
</script>

<template>
  <AcvDrawer
    v-model="isDrawerShown"
    title="CARPE DIEM, SESTIUS"
    subtitle="Solvitur acris hiems grata vice veris et Favoni
trahuntque siccas machinae carinas"
  />

  <AcvButton @click="isDrawerShown = true">
    Show drawer
  </AcvButton>
</template>
