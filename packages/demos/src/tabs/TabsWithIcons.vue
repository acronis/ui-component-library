<script setup>
  import AcvTabs from '@/components/tabs/tabs.vue';
  import { IconBell24 } from '@acronis-platform/icons/bell';
  import { IconSettings16 } from '@acronis-platform/icons/settings';
  import { IconUser16 } from '@acronis-platform/icons/user';

  const tabs = [
    { label: 'Left', icon: IconUser16 },
    { label: 'Middle', icon: IconBell24 },
    { label: 'Right', icon: IconSettings16 },
  ];
</script>

<template>
  <AcvTabs
    :tabs="tabs"
  />
</template>
