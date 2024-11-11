<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvLoading from '@/components/loading/loading.vue';
  import { ref } from 'vue';

  const spinnerColors = ['primary', 'secondary', 'white', 'black', 'purple'];
  const loading = ref(false);
  const color = ref(spinnerColors[0]);

  function showLoading() {
    loading.value = true;
    const currSpinnerColor = spinnerColors.indexOf(color.value);
    color.value = spinnerColors[currSpinnerColor + 1] || spinnerColors[0];
  }
</script>

<template>
  <AcvButton @click="showLoading">
    Show loading
  </AcvButton>
  <AcvLoading
    v-model="loading"
    fullscreen
    :opacity="0.7"
    background="secondary"
    :color="color"
    :title="`Loading with ${color} spinner`"
    @click="loading = false"
  />
</template>
