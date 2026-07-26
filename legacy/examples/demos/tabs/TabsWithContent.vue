<script setup>
  import AcvTabs from '@/components/tabs/tabs.vue';

  const tabs = [
    { label: 'Left', content: 'left content' },
    { label: 'Middle', content: 'middle content' },
    { label: 'Right', content: 'right content' },
  ];
</script>

<template>
  <AcvTabs
    :tabs="tabs"
  />
</template>
