<template>
  <preview-group>
    <preview name="Default" span="6">
      <el-chip icon="i-console-o--16">Text</el-chip>
    </preview>
    <preview name="Without icon" span="6">
      <el-chip>Text</el-chip>
    </preview>
    <preview name="Read-only" span="6">
      <el-chip icon="i-console-o--16" :show-Close="false">Text</el-chip>
    </preview>
    <preview name="Read-only without icon" span="6">
      <el-chip :show-Close="false">Text</el-chip>
    </preview>
    <preview name="Max width 300px" span="12">
      <el-chip icon="i-omnivoice-sms-packages-o--16" show-hover-hint>www.mydomain.com/pathofpage/pathofpage</el-chip>
    </preview>
  </preview-group>
</template>

<script setup>
import ElChip from 'packages/chip';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
</script>

