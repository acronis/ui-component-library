<script setup>
  import { AcvPagination } from '@acronis-platform/ui-component-library';
  import { ref } from 'vue';

  const currentPage = ref(1);
</script>

<template>
  <AcvPagination
    v-model="currentPage"
    :total="7"
    :limit="1"
  />
</template>
