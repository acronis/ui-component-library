<script setup>
  import AcvAside from '@/components/aside/aside.vue';
  import AcvMenu from '@/components/menu/menu.vue';
  import AcvMenuItem from '@/components/menu-item/menuItem.vue';
  import { IconApps16 } from '@acronis-platform/icons/apps';
  import { IconCase16 } from '@acronis-platform/icons/case';
  import { IconPartition16 } from '@acronis-platform/icons/partition';
  import { IconProtect16 } from '@acronis-platform/icons/protect';
  import { IconSettings16 } from '@acronis-platform/icons/settings';
  import { ref } from 'vue';
  import Logo from './assets/CyberProtectCloudLogo.vue';

  const selectedMenu = ref('case');
</script>

<template>
  <AcvAside color="nav-primary">
    <AcvMenu
      v-model="selectedMenu"
      type="primary"
    >
      <template #prepend>
        <div class="acv-grid place-items-center">
          <Logo />
        </div>
      </template>
      <AcvMenuItem :icon="IconPartition16">
        Overview
      </AcvMenuItem>
      <AcvMenuItem
        index="case"
        :icon="IconCase16"
      >
        Business Management
      </AcvMenuItem>
      <AcvMenuItem :icon="IconProtect16">
        ProtectionProtectionProtection
      </AcvMenuItem>
      <AcvMenuItem :icon="IconApps16">
        Other services
      </AcvMenuItem>
      <AcvMenuItem :icon="IconSettings16">
        Company management
      </AcvMenuItem>
    </AcvMenu>
  </AcvAside>
</template>
