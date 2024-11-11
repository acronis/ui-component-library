<script setup>
  import AcvMenu from '@/components/menu/menu.vue';
  import AcvMenuItem from '@/components/menu-item/menuItem.vue';
  import AcvTag from '@/components/tag/tag.vue';
  import { IconPlaceholder24 } from '@acronis-platform/icons/placeholder';
</script>

<template>
  <AcvMenu>
    <AcvMenuItem :icon="IconPlaceholder24">
      Item
    </AcvMenuItem>
    <AcvMenuItem :icon="IconPlaceholder24">
      Item with second line of text
    </AcvMenuItem>
    <AcvMenuItem :icon="IconPlaceholder24">
      Item
      <template #append>
        <AcvTag>7</AcvTag>
      </template>
    </AcvMenuItem>
    <AcvMenuItem :icon="IconPlaceholder24">
      Item
      <template #append>
        <AcvTag type="success">
          New
        </AcvTag>
      </template>
    </AcvMenuItem>
    <AcvMenu>
      <AcvMenuItem>
        Sub item
      </AcvMenuItem>
    </AcvMenu>
    <AcvMenu title="Title">
      <AcvMenuItem>
        Sub item
      </AcvMenuItem>
    </AcvMenu>
  </AcvMenu>
</template>
