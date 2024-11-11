<script setup>
  import AcvList from '@/components/list/list.vue';
  import AcvListItem from '@/components/list-item/listItem.vue';
  import items from '../../__mocks__/data.mock.list.json';
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
