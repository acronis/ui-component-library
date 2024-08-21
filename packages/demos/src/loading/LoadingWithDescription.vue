<script setup>
  import { ref } from 'vue';
  import AcvLoading from '@/widgets/loading/loading.vue';

  const loading = ref(true);
</script>

<template>
  <AcvLoading
    v-model="loading"
    description="Wait until it is completed."
    :background="false"
  />
</template>
