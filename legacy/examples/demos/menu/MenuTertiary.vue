<script setup>
  import AcvMenu from '@/components/menu/menu.vue';
  import AcvMenuItem from '@/components/menu-item/menuItem.vue';
  import AcvTag from '@/components/tag/tag.vue';
  import { IconCase16 } from '@acronis-platform/icons/case';
  import { IconPartition16 } from '@acronis-platform/icons/partition';
  import { ref } from 'vue';

  const selectedMenu = ref('second');
</script>

<template>
  <AcvMenu
    v-model="selectedMenu"
    type="tertiary"
  >
    <template #prepend>
      <AcvMenuItem>
        HEADER
      </AcvMenuItem>
    </template>
    <AcvMenuItem :icon="IconPartition16">
      First item
    </AcvMenuItem>
    <AcvMenuItem
      index="second"
      :icon="IconCase16"
    >
      Second item
    </AcvMenuItem>
    <AcvMenuItem id="third">
      Third item
      <template #append>
        <AcvTag>5</AcvTag>
      </template>
    </AcvMenuItem>
    <AcvMenuItem>
      Fourth item
    </AcvMenuItem>
    <AcvMenuItem>
      Fifth item
    </AcvMenuItem>
  </AcvMenu>
</template>
