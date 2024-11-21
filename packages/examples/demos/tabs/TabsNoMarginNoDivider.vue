<script setup>
  import AcvTabPane from '@/components/tab-pane/tab-pane.vue';
  import AcvTabs from '@/components/tabs/tabs.vue';
</script>

<template>
  <AcvTabs
    no-divider
    no-margin
  >
    <AcvTabPane
      label="Left"
      name="left"
    >
      <span class="el-text el-text--body-32">Left</span>
    </AcvTabPane>
    <AcvTabPane
      label="Middle"
      name="middle"
    >
      <span class="el-text el-text--body-32">Middle</span>
    </AcvTabPane>
    <AcvTabPane
      label="Right"
      name="right"
    >
      <span class="el-text el-text--body-32">Right</span>
    </AcvTabPane>
  </AcvTabs>
</template>
