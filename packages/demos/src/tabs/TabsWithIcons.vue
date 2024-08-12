<script setup>
  import AcvTabs from '@/components/tabs/tabs.vue';

  const tabs = [
    { title: 'First', icon: 'i-bx-user' },
    { title: 'Second', icon: 'i-bx-bell' },
    { title: 'Third', icon: 'i-bx-cog' },
  ];
</script>

<template>
  <AcvTabs
    :tabs="tabs"
  />
</template>
