<template>
  <preview-group class="qa-card-variants">
    <preview name="Success" span="6" align-items="stretch">
      <el-card class="demo-card-container" border-color="fixed-success"></el-card>
    </preview>
    <preview name="Warning" span="6" align-items="stretch">
      <el-card class="demo-card-container" border-color="fixed-warning"></el-card>
    </preview>
    <preview name="Critical" span="6" align-items="stretch">
      <el-card class="demo-card-container" border-color="fixed-critical"></el-card>
    </preview>
    <preview name="Danger" span="6" align-items="stretch">
      <el-card class="demo-card-container" border-color="fixed-danger"></el-card>
    </preview>
  </preview-group>
</template>

<script setup>
import ElCard from 'packages/card';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
</script>

<style lang="scss" scoped>
  .demo-card-container {
    width: 100%;
    height: 128px;
  }
</style>
