<script setup>
  import { ref } from 'vue';
  import AcvTabs from '@/components/tabs/tabs.vue';
  import AcvTab from '@/components/tabs/tab.vue';

  const activeTab = ref();
</script>

<template>
  <AcvTabs
    v-model="activeTab"
    size="large"
  >
    <AcvTab title="Label">
      Test
    </AcvTab>
    <AcvTab title="Label 2">
      Test 2
    </AcvTab>
  </AcvTabs>
</template>
