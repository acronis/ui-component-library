<script setup>
  import LoremIpsum from '../__data__/data.mock.lorem.js';
  import AcvScrollbar from '@/components/scrollbar/scrollbar.vue';

  function handleScroll() {
    console.log('scroll');
  }
</script>

<template>
  <AcvScrollbar
    class="test"
    @scroll="handleScroll"
  >
    <span class="content">{{ LoremIpsum }}</span>
  </AcvScrollbar>
</template>

<style scoped>
  .test {
    max-height: 300px;
    max-width: 300px;
  }

  .content {
    display: inline-block;
    min-width: 600px;
    padding: 10px;
  }
</style>
