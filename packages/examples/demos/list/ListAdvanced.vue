<script setup>
  import AcvCard from '@/components/card/card.vue';
  import AcvCounter from '@/components/counter/counter.vue';
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvList from '@/components/list/list.vue';
  import AcvListItem from '@/components/list-item/listItem.vue';
  import AcvTag from '@/components/tag/tag.vue';
  import items from '../../__mocks__/data.mock.list.json';

  function handleClose(id) {
    console.log('Close item with id:', id);
  }
</script>

<template>
  <AcvCard :padding="false">
    <AcvList v-model="items">
      <template #item="{ item }">
        <AcvListItem
          :data="item"
          :fixed="item.fixed"
          :title="item.title"
          :closable="!item.fixed"
          @close="() => handleClose(item.id)"
        >
          <AcvIcon
            :name="item.icon"
            color="primary"
            class="mr-8"
          />
          <span class="acv-list-item__title acv-text acv-text--body-24 ml-8">
            {{ item.title }}
          </span>
          <AcvIcon
            v-if="item.secondaryIcon"
            :name="item.secondaryIcon"
            color="primary"
            class="ml-8"
          />
          <span
            v-if="item.tag"
            class="ml-8"
          >
            <AcvTag
              small
              type="success"
            >{{ item.tag }}</AcvTag>
          </span>
          <template #right>
            <span class="acv-list-item__subtitle acv-text acv-text--caption mx-16">
              {{ item.subtitle }}
            </span>
            <AcvCounter>{{ item.counter }}</AcvCounter>
          </template>
        </AcvListItem>
      </template>
    </AcvList>
  </AcvCard>
</template>
