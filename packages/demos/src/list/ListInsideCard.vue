<script setup>
  import items from '../__data__/data.mock.list.json';
  import AcvCard from '@/components/card/card.vue';
  import AcvList from '@/components/list/list.vue';
  import AcvListItem from '@/components/list-item/listItem.vue';
</script>

<template>
  <AcvCard :padding="false">
    <AcvList v-model="items">
      <template #item="{ item }">
        <AcvListItem
          :data="item"
          :fixed="item.fixed"
          :title="item.title"
        />
      </template>
    </AcvList>
  </AcvCard>
</template>
