<script setup>
  import AcvScrollbar from '@/components/scrollbar/scrollbar.vue';
  import LoremIpsum from '../../__mocks__/data.mock.lorem.js';

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
