<template>
  <preview-group class="qa-button-basic">
    <preview name="Primary" span="6">
      <el-button>Button</el-button>
    </preview>
    <preview name="Secondary" span="6">
      <el-button type="secondary">Button</el-button>
    </preview>
    <preview name="Success" span="6">
      <el-button type="success">Button</el-button>
    </preview>
    <preview name="Danger" span="6">
      <el-button type="danger">Button</el-button>
    </preview>
    <preview name="Ghost" span="6">
      <el-button type="ghost">Button</el-button>
    </preview>
    <preview name="Promo" span="6">
      <el-button type="promo">Button</el-button>
    </preview>
    <preview name="Translucent" span="6" class="dark-bg">
      <div class="dark-bg">
        <el-button type="translucent">Button</el-button>
      </div>
    </preview>
  </preview-group>
</template>

<script setup>
  import ElButton from 'packages/button';
  import PreviewGroup from 'examples/components/preview-group.vue';
  import Preview from 'examples/components/preview.vue';
</script>

<style lang="scss" scoped>
  @import 'themes/acronis/src/common/variables/colors';

  .dark-bg {
    background-color: $av-nav-primary;
    background-clip: padding-box;
  }

  .dark-bg :deep(.preview__caption) {
    color: $av-nav-text;
  }
</style>
