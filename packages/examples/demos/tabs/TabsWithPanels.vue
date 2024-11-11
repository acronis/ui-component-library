<script setup>
  import AcvTabs from '@/components/tabs/tabs.vue';
  import { ref } from 'vue';

  const tabs = [
    { label: 'First', value: 'first' },
    'Second',
    'Third'
  ];
  const activeTab = ref('Second');
</script>

<template>
  <AcvTabs
    v-model="activeTab"
    :tabs="tabs"
  >
    <template #first>
      First tab
    </template>
    <template #Second>
      Second tab
    </template>
    <template #Third>
      Third tab
    </template>
  </AcvTabs>
</template>
