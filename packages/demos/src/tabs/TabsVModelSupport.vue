<script setup>
  import { ref } from 'vue';
  import AcvTabs from '@/components/tabs/tabs.vue';

  const tabs = ['First', 'Second', 'Third'];

  const activeTab = ref('Second');
</script>

<template>
  {{ activeTab }}
  <AcvTabs
    v-model="activeTab"
    :tabs="tabs"
  />
</template>
