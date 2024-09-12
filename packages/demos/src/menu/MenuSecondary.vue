<script setup>
  import { IconPartition16 } from '@acronis-platform/icons/partition';
  import { IconCase16 } from '@acronis-platform/icons/case';
  import { ref } from 'vue';
  import AcvMenu from '@/components/menu/menu.vue';
  import AcvMenuItem from '@/components/menu-item/menuItem.vue';
  import AcvTag from '@/components/tag/tag.vue';

  const selectedMenu = ref('second');
</script>

<template>
  <AcvMenu
    v-model="selectedMenu"
    type="secondary"
  >
    <AcvMenuItem
      index="first"
      :icon="IconPartition16"
    >
      FIRST
    </AcvMenuItem>
    <AcvMenuItem
      index="second"
      :icon="IconCase16"
    >
      SECOND
    </AcvMenuItem>
    <AcvMenuItem index="third">
      THIRD
      <template #append>
        <AcvTag>5</AcvTag>
      </template>
    </AcvMenuItem>
    <AcvMenuItem>
      FOURTH
    </AcvMenuItem>
  </AcvMenu>
</template>
