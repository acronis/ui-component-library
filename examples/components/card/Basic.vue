<template>
  <preview-group class="qa-card-basic">
    <preview name="Default" span="8" align-items="stretch">
      <el-card class="demo-card-container"></el-card>
    </preview>
    <preview name="Focus" span="8" align-items="stretch">
      <el-card class="demo-card-container" focus></el-card>
    </preview>
    <preview name="Modal" span="8" align-items="stretch" background="fixed-modal">
      <el-card class="demo-card-container" modal></el-card>
    </preview>
  </preview-group>
</template>

<script setup>
import ElCard from 'packages/card';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

</script>

<style lang="scss" scoped>
  @import 'themes/acronis/src/common/variables/colors';
  .demo-card-container {
    width: 100%;
    height: 128px;
  }
</style>
