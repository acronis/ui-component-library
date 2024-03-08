<template>
  <preview-group class="qa-card-variants">
    <preview class="dark-bg" name="Fixed White (default)" span="6" align-items="stretch">
      <el-card class="demo-card-container" border-color="fixed-success" background-color="fixed-white"></el-card>
    </preview>
    <preview class="dark-bg" name="Transparent" span="6" align-items="stretch">
      <el-card class="demo-card-container" border-color="fixed-success" background-color="transparent"></el-card>
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

  .dark-bg {
    background-color: $av-brand-lighter;
    background-clip: padding-box;
  }
</style>
