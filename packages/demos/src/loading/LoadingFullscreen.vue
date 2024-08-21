<script setup>
  import { ref } from 'vue';
  import AcvLoading from '@/widgets/loading/loading.vue';
  import AcvButton from '@/components/button/button.vue';

  const loading = ref(false);
</script>

<template>
  <AcvButton @click="loading = !loading">
    Show loading
  </AcvButton>
  <AcvLoading
    v-model="loading"
    size="x-large"
    fullscreen
    @click="loading = false"
  />
</template>
