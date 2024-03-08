<template>
  <whatisnew-items-list
    ref="whatisnewItemsList"
    :back-button-text="backButtonText"
    :next-button-text="nextButtonText"
    :finish-button-text="finishButtonText"
    @finish="$emit('finish', $event)"
  >
    <whatisnew-item
      v-for="(item, index) in items"
      :key="index"
      :title="item.title"
      :image-slot="item.imageSlot"
      :show-upsell-badge="item.showUpsellBadge"
    >
      <template #upsell-badge>
        <slot name="upsell-badge" />
      </template>
      <template #[item.imageSlot]>
        <slot :name="item.imageSlot" />
      </template>
      {{ item.content }}
    </whatisnew-item>
  </whatisnew-items-list>
</template>

<script>
  import WhatisnewItem from './whatisnewItem.vue';
  import WhatisnewItemsList from './whatisnewItemsList.vue';

  export default {
    name: 'WhatIsNewInfo',
    components: { WhatisnewItemsList, WhatisnewItem },
    props: {
      backButtonText: {
        type: String,
        default: ''
      },
      nextButtonText: {
        type: String,
        default: ''
      },
      finishButtonText: {
        type: String,
        default: ''
      },

      items: {
        type: Array,
        required: true
      }
    }
  };
</script>
