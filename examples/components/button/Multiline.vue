<template>
  <preview-group class="qa-button-multiline">
    <preview name="Default" span="6">
      <el-button multiline>Multi-line button</el-button>
    </preview>
    <preview class="dark-bg" name="Translucent" span="6">
      <el-button
        multiline
        type="translucent"
      >
        Multi-line button
      </el-button>
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
