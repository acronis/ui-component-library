<script setup>
  import { ref } from 'vue';
  import AcvLoading from '@/widgets/loading/loading.vue';

  const loading = ref(true);
</script>

<template>
  <AcvLoading
    v-model="loading"
    title="Data is loading..."
    :background="false"
  />
</template>
