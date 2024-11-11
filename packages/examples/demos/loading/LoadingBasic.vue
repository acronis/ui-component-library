<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvLoading from '@/components/loading/loading.vue';
  import { ref } from 'vue';

  const loading = ref(false);
</script>

<template>
  <AcvButton @click="loading = !loading">
    Show loading
  </AcvButton>
  <AcvLoading
    v-model="loading"
    fullscreen
    @click="loading = false"
  />
</template>
