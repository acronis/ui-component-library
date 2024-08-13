<script setup>
  import { ref } from 'vue';
  import AcvTabs from '@/components/tabs/tabs.vue';

  const tabs = [
    'Left',
    'Middle',
    'Right'
  ];
  const activeTab = ref('Middle');
</script>

<template>
  <AcvTabs
    v-model="activeTab"
    :tabs="tabs"
    size="large"
  >
    <template #tab-Left>
      Label template
    </template>
    <template #Left>
      Left content
    </template>
    <template #Middle>
      Middle content
    </template>
    <template #Right>
      Right content
    </template>
  </AcvTabs>
</template>
