<script setup>
  import AcvTabs from '@/components/tabs/tabs.vue';
  import { IconFromCloud24 } from '@acronis-platform/icons/from';
  import { IconSettings16 } from '@acronis-platform/icons/settings';
  import { IconToCloud24 } from '@acronis-platform/icons/to';
  import { ref } from 'vue';

  const tabs = [
    { label: 'Left', icon: IconFromCloud24 },
    { label: 'Middle', icon: IconToCloud24, appendIcon: IconFromCloud24 },
    { label: 'Right', icon: IconSettings16 },
  ];
  const activeTab = ref();
</script>

<template>
  <AcvTabs
    v-model="activeTab"
    :tabs="tabs"
    size="large"
  />
</template>
