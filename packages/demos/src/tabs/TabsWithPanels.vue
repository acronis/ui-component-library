<script setup>
  import AcvTabs from '@/components/tabs/tabs.vue';

  const tabs = [
    { title: 'First', value: 'first' },
    'Second',
    'Third'
  ];
</script>

<template>
  <AcvTabs
    :tabs="tabs"
  >
    <template #first>
      First tab
    </template>
    <template #second>
      Second tab
    </template>
    <template #third>
      Third tab
    </template>
  </AcvTabs>
</template>
