<script setup>
  import AcvTabs from '@/components/tabs/tabs.vue';

  const tabs = [
    { label: 'Left', value: 'left-slot' },
    { label: 'Middle' },
    { label: 'Right' },
  ];
</script>

<template>
  <AcvTabs
    :tabs="tabs"
  >
    <template #tab-left-slot>
      Slotted Label
    </template>
    <template #left-slot>
      Slotted Content
    </template>
  </AcvTabs>
</template>
