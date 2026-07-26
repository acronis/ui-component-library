<script setup>
  import AcvTabPane from '@/components/tab-pane/tab-pane.vue';
  import AcvTabs from '@/components/tabs/tabs.vue';
</script>

<script>
  export default {
    data: () => ({
      showDivider: true,
      spacing: true,
    }),
  };
</script>

<template>
  <preview-group class="qa-tabs-divider-and-margin">
    <preview
      span="12"
      name="No divider"
    >
      <AcvTabs no-divider>
        <AcvTabPane
          label="Left"
          name="left"
        >
          <span class="el-text el-text--body-32 mx-24">Left</span>
        </AcvTabPane>
        <AcvTabPane
          label="Middle"
          name="middle"
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
    </preview>
    <preview
      span="12"
      name="No margin"
    >
      <AcvTabs no-margin>
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
    </preview>
    <preview
      span="24"
      name="No margin and no divider"
    >
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
    </preview>
  </preview-group>
</template>
