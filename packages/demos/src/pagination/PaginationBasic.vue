<script setup>
  import { ref } from 'vue';
  import { AcvPagination } from '@acronis-platform/ui-component-library';

  const currentPage = ref(1);
</script>

<template>
  <AcvPagination
    v-model="currentPage"
    :total="7"
    :limit="1"
  />
</template>
