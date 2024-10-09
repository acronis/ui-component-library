<script setup>
  import AcvMenu from '@/components/menu/menu.vue';
  import AcvMenuItem from '@/components/menu-item/menuItem.vue';
  import AcvTag from '@/components/tag/tag.vue';
  import { IconALogo32 } from '@acronis-platform/icons/a';
  import { IconInfo16 } from '@acronis-platform/icons/info';
  import { IconPlaceholder16 } from '@acronis-platform/icons/placeholder';
  import { ref } from 'vue';

  const menuIsCollapsed = ref(false);
  function toggleCollapse() {
    menuIsCollapsed.value = !menuIsCollapsed.value;
  }
</script>

<template>
  <AcvMenu
    index="menu-0"
    :collapse="menuIsCollapsed"
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
    <AcvMenuItem
      index="item-0-0"
      :icon="IconPlaceholder16"
      :clamp="2"
    >
      ITEM WITH SECOND LINE, ITEM WITH SECOND LINE, ITEM WITH SECOND LINE
    </AcvMenuItem>
    <AcvMenuGroup index="menu-0-1">
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

      <AcvMenuGroup index="menu-1-0">
        <AcvMenuItem index="item-2.0">
          Subitem with tag
          <template #append>
            <AcvTag>
              5
            </AcvTag>
          </template>
        </AcvMenuItem>
        <AcvMenuItem index="item-2.1">
          Subitem with small tag
          <template #append>
            <AcvTag small>
              NEW
            </AcvTag>
          </template>
        </AcvMenuItem>
        <AcvMenuItem index="item-2.2">
          Item 2.3
        </AcvMenuItem>
      </AcvMenuGroup>
    </AcvMenuGroup>

    <template #append>
      <AcvMenuItem
        index="profile"
        :icon="IconPlaceholder16"
      >
        Profile
      </AcvMenuItem>
      <AcvMenuItem
        index="help"
        :icon="IconPlaceholder16"
      >
        Help
      </AcvMenuItem>
      <AcvMenuItem
        index="collapse"
        :icon="IconPlaceholder16"
        @click="toggleCollapse"
      >
        Collapse menu
      </AcvMenuItem>
    </template>
  </AcvMenu>
</template>
