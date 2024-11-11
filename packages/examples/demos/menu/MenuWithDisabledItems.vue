<script setup>
  import AcvMenu from '@/components/menu/menu.vue';
  import AcvMenuItem from '@/components/menu-item/menuItem.vue';
  import { IconALogo32 } from '@acronis-platform/icons/a';
  import { IconInfo16 } from '@acronis-platform/icons/info';
  import { IconPlaceholder16 } from '@acronis-platform/icons/placeholder';
  import { ref } from 'vue';

  const activeMenuItem = ref('item-0-0');
</script>

<template>
  <AcvMenu
    v-model="activeMenuItem"
    index="menu-0"
  >
    <template #prepend>
      <AcvMenuItem :icon="IconALogo32">
        Test logo
      </AcvMenuItem>
    </template>
    <AcvMenuItem
      index="item-0-0"
      :icon="IconPlaceholder16"
    >
      ITEM
    </AcvMenuItem>
    <AcvMenu index="menu-0-1">
      <AcvMenuItem
        index="item-1.0"
        :icon="IconPlaceholder16"
        disabled
      >
        Disabled subitem
      </AcvMenuItem>
      <AcvMenuItem
        index="item-1.1"
        :icon="IconInfo16"
      >
        Subitem with ellipsis with ellipsis with ellipsis
      </AcvMenuItem>
      <AcvMenuItem
        index="item-1.2"
        clamp
      >
        Subitem with second line of text
      </AcvMenuItem>
    </AcvMenu>
  </AcvMenu>
</template>
