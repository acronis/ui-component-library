<script setup>
  import AcvMenu from '@/components/menu/menu.vue';
  import AcvMenuGroup from '@/components/menu-group/menuGroup.vue';
  import AcvMenuItem from '@/components/menu-item/menuItem.vue';
  import AcvTag from '@/components/tag/tag.vue';
  import { IconALogo32 } from '@acronis-platform/icons/a';
  import { IconInfo16 } from '@acronis-platform/icons/info';
  import { IconPlaceholder16 } from '@acronis-platform/icons/placeholder';
  import { ref } from 'vue';

  const menuIsCollapsed = ref(false);
  const selectedMenu = ref(null);
  function toggleCollapse() {
    menuIsCollapsed.value = !menuIsCollapsed.value;
  }
</script>

<template>
  <AcvMenu
    id="menu-0"
    v-model="selectedMenu"
    :collapse="menuIsCollapsed"
  >
    <template #prepend>
      <AcvMenuItem :icon="IconALogo32">
        Logotype
      </AcvMenuItem>
    </template>
    <AcvMenuItem
      id="item-0-0"
      :icon="IconPlaceholder16"
    >
      ITEM
    </AcvMenuItem>
    <AcvMenuItem
      id="item-0-0"
      :icon="IconPlaceholder16"
      :clamp="2"
    >
      ITEM WITH SECOND LINE, ITEM WITH SECOND LINE, ITEM WITH SECOND LINE
    </AcvMenuItem>
    <AcvMenuGroup
      id="menu-0-1"
      title="Group title"
    >
      <AcvMenuItem
        id="item-1.0"
        :icon="IconPlaceholder16"
        disabled
      >
        Disabled subitem
      </AcvMenuItem>
      <AcvMenuItem
        id="item-1.1"
        :icon="IconInfo16"
      >
        Subitem with ellipsis with ellipsis with ellipsis
      </AcvMenuItem>
      <AcvMenuItem
        id="item-1.2"
        clamp
      >
        Subitem with second line of text
      </AcvMenuItem>

      <AcvMenuGroup id="menu-1-0">
        <AcvMenuItem id="item-2.0">
          Subitem with tag
          <template #append>
            <AcvTag>
              5
            </AcvTag>
          </template>
        </AcvMenuItem>
        <AcvMenuItem id="item-2.1">
          Subitem with small tag
          <template #append>
            <AcvTag small>
              NEW
            </AcvTag>
          </template>
        </AcvMenuItem>
        <AcvMenuItem id="item-2.2">
          Item 2.3
        </AcvMenuItem>
      </AcvMenuGroup>
    </AcvMenuGroup>

    <template #append>
      <AcvMenuItem
        id="profile"
        :icon="IconPlaceholder16"
      >
        Profile
      </AcvMenuItem>
      <AcvMenuItem
        id="help"
        :icon="IconPlaceholder16"
      >
        Help
      </AcvMenuItem>
      <AcvMenuItem
        id="collapse"
        :icon="IconPlaceholder16"
        @click="toggleCollapse"
      >
        Collapse menu
      </AcvMenuItem>
    </template>
  </AcvMenu>
</template>
