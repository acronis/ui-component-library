<script setup>
  import AcvTabPane from '@/components/tab-pane/tab-pane.vue';
  import AcvTabs from '@/components/tabs/tabs.vue';
</script>

<template>
  <div class="qa-tabs-basic">
    <AcvTabs>
      <AcvTabPane
        label="Left"
        name="left"
      >
        <span class="el-text el-text--body-32 mx-24">Left</span>
      </AcvTabPane>
      <AcvTabPane
        label="Middle"
        name="middle"
        disabled
      >
        <span class="el-text el-text--body-32 mx-24">Middle</span>
      </AcvTabPane>
      <AcvTabPane
        label="Right"
        name="right"
      >
        <span class="el-text el-text--body-32 mx-24">Right</span>
      </AcvTabPane>
    </AcvTabs>
  </div>
</template>
