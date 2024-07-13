<script setup>
  import items from '../__data__/data.mock.list.json';
  import AcvList from '@/components/list/list.vue';
  import AcvListItem from '@/components/list-item/listItem.vue';
</script>

<template>
  <AcvList
    v-model="items"
    card
  >
    <template #item="{ item }">
      <AcvListItem
        :data="item"
        :fixed="item.fixed"
        :title="item.title"
      />
    </template>
  </AcvList>
</template>
