<script setup>
  import { ref } from 'vue';

  const isDrawerShown = ref(false);
</script>

<template>
  <AcvDrawer
    v-model="isDrawerShown"
    title="CARPE DIEM, SESTIUS"
    subtitle="Solvitur acris hiems grata vice veris et Favoni
trahuntque siccas machinae carinas"
    class="!w-[400px]"
  />

  <AcvButton @click="isDrawerShown = true">
    Show drawer
  </AcvButton>
</template>
