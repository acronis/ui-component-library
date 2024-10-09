<script setup>
  import AcvCounter from '@/components/counter/counter.vue';
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvTag from '@/components/tag/tag.vue';
  import { IconPlaceholder16, IconPlaceholder24 } from '@acronis-platform/icons/placeholder';
  // import AcvTypography from '../typography/typography.vue';
  import AcvListItem from '@/components/list-item/listItem.vue';
</script>

<template>
  <AcvListItem
    title="Item name"
    subtitle="Additional info"
  />

  <AcvListItem
    title="Item name"
    subtitle="Additional info"
    closable
  />

  <AcvListItem
    title="Item name"
    subtitle="Additional info"
    closable
  >
    <template #right>
      Additional info
      <AcvCounter count="5" />
    </template>
  </AcvListItem>

  <AcvListItem
    title="Item name"
    subtitle="Additional info"
    draggable
  />

  <AcvListItem title="Item name">
    <AcvIcon
      class="mr-8"
      :icon="IconPlaceholder24"
    />
    Item Name
    <AcvIcon
      class="mx-8"
      :icon="IconPlaceholder16"
      size="small"
    />
    <AcvTag color="success">
      Tag
    </AcvTag>

    <template #right>
      Additional info
      <AcvCounter count="5" />
    </template>
  </AcvListItem>

  <AcvListItem :icon="IconPlaceholder16">
    <ul>
      <li>First line</li>
      <li>Second Line</li>
      <li>Third line</li>
    </ul>
  </AcvListItem>
</template>
