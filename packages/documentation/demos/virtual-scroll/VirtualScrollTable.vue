<script setup>
import items from '../__data__/data.mock.1000.json';
import AcvVirtualScroll from '@/components/virtual-scroll/virtualScroll.vue';
</script>

<template>
  <AcvVirtualScroll :items="items">
    <template #item="{ name }">
      {{ name }}
    </template>
  </AcvVirtualScroll>
</template>
