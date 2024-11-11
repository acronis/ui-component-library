<script setup>
  import AcvCard from '@/components/card/card.vue';
  import AcvList from '@/components/list/list.vue';
  import AcvListItem from '@/components/list-item/listItem.vue';
  import items from '../../__mocks__/data.mock.list.json';
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
