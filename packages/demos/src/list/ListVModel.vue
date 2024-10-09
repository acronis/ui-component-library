<script setup>
  import AcvCard from '@/components/card/card.vue';
  import AcvList from '@/components/list/list.vue';
  import AcvListItem from '@/components/list-item/listItem.vue';
  import { ref } from 'vue';

  const items = [
    { title: 'Donut jujubes' },
    { title: 'Sesame snaps' },
    { title: 'I love jelly' },
    { title: 'Cake gummi', disabled: true },
  ];

  const itemsPropSelection = ref(null);
  const slotSelection = ref(null);
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-2 place-items-stretch all:flex-grow">
    <!-- Using `items` prop -->
    <AcvCard>
      <AcvList
        v-model="itemsPropSelection"
        :items="items"
        class="[--a-list-gap:0.25rem]"
      >
        <template #after>
          <hr class="my-2">
          <AcvList
            class="mb-0"
            :items="[{ subtitle: `Selected: ${itemsPropSelection && itemsPropSelection.text}` }]"
          />
        </template>
      </AcvList>
    </AcvCard>

    <!-- Using AcvListItem in default slot -->
    <AcvCard>
      <AcvList
        v-model="slotSelection"
        :items="items"
        class="[--a-list-gap:0.25rem]"
      >
        <template #default="{ handleListItemClick }">
          <AcvListItem
            v-for="(item, index) in items"
            :key="item.text"
            :text="item.text"
            :value="index"
            :disabled="item.disabled"
            :is-active="slotSelection?.text === item.text"
            @click="handleListItemClick(item)"
          />
        </template>
        <template #after>
          <hr class="my-2">
          <AcvList
            class="mb-0"
            :items="[{ subtitle: `Selected: ${slotSelection && slotSelection.text}` }]"
          />
        </template>
      </AcvList>
    </AcvCard>
  </div>
</template>
