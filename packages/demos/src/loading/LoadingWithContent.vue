<script setup>
  import AcvLoading from '@/components/loading/loading.vue';
  import { ref } from 'vue';

  const loading = ref(true);
</script>

<template>
  <AcvLoading
    v-model="loading"
    size="x-large"
    title="Data is loading"
    description="Wait until it is completed."
    :background="false"
  />
</template>
