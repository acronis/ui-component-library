<script setup>
  import AcvCounter from '@/components/counter/counter.vue';
  import AcvListItem from '@/components/list-item/listItem.vue';
</script>

<template>
  <AcvListItem
    title="Item name"
    closable
  >
    <template #right>
      Additional info
      <AcvCounter count="5" />
    </template>
  </AcvListItem>
</template>
