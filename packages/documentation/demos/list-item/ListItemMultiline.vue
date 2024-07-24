<script setup>
  import { IconPlaceholder16 } from '@acronis-platform/icons/placeholder';
  import AcvListItem from '@/components/list-item/listItem.vue';
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
