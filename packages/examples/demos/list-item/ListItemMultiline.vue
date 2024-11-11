<script setup>
  import AcvListItem from '@/components/list-item/listItem.vue';
  import { IconPlaceholder16 } from '@acronis-platform/icons/placeholder';
</script>

<template>
  <AcvListItem :icon="IconPlaceholder16">
    <ul>
      <li>First line</li>
      <li>Second Line</li>
      <li>Third line</li>
    </ul>
  </AcvListItem>
</template>
