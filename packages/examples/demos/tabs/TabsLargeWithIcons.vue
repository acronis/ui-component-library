<script setup>
  import AcvTabPane from '@/components/tab-pane/tab-pane.vue';
  import AcvTabs from '@/components/tabs/tabs.vue';

  import { IconFromCloud24 } from '@acronis-platform/icons/from';
  import { IconSettings16 } from '@acronis-platform/icons/settings';
  import { IconToCloud24 } from '@acronis-platform/icons/to';
  import { ref } from 'vue';

  const largeWithIcons = ref('toCloud');
</script>

<template>
  <AcvTabs
    v-model="largeWithIcons"
    large
  >
    <AcvTabPane name="fromCloud">
      <template #icon>
        <IconFromCloud24 />
      </template>
      <span class="el-text el-text--body-32 mx-24">From cloud</span>
    </AcvTabPane>
    <AcvTabPane name="toCloud">
      <template #icon>
        <IconToCloud24 />
      </template>
      <span class="el-text el-text--body-32 mx-24">To cloud</span>
    </AcvTabPane>
    <AcvTabPane name="syncShare">
      <template #icon>
        <IconSettings16 />
      </template>
      <span class="el-text el-text--body-32 mx-24">Sync share</span>
    </AcvTabPane>
  </AcvTabs>
</template>
