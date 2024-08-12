<script setup>
  import { ref } from 'vue';
  import AcvTabs from '@/components/tabs/tabs.vue';
  import AcvTab from '@/components/tabs/tab.vue';
  import AcvIcon from '@/components/icon/icon.vue';

  const activeTab = ref();
</script>

<template>
  <AcvTabs
    v-model="activeTab"
    size="large"
  >
    <AcvTab title="Label">
      <template #icon>
        <AcvIcon name="from-cloud-o--24" />
      </template>
      Test
    </AcvTab>
    <AcvTab title="Label 2">
      <template #icon>
        <AcvIcon name="to-cloud-o--24" />
      </template>
      Test 2
    </AcvTab>
  </AcvTabs>
</template>
