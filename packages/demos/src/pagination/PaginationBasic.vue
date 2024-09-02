<script setup>
  import { ref } from 'vue';
  import AcvPagination from '@/components/pagination/AcvPagination.vue';

  const currentPage = ref(1);
</script>

<template>
  <AcvPagination
    v-model="currentPage"
    :total="7"
    :limit="1"
  />
</template>
