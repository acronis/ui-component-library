<script setup>
  import { ref } from 'vue';
  import AcvSearch from '@/components/search/search.vue';

  const search = ref('');
</script>

<template>
  <AcvSearch
    v-model="search"
    placeholder="Search"
  />
</template>
