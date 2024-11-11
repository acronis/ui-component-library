<script setup>
  import AcvSearch from '@/components/search/search.vue';
  import { ref } from 'vue';

  const search = ref('');
</script>

<template>
  <AcvSearch
    v-model="search"
    placeholder="Search"
  />
</template>
