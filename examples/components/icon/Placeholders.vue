<template>
  <preview-group class="qa-icon-placeholders">
    <preview name="size: 64" span="6">
      <el-icon name="i-workstations-o--32" size="64" color="brand-primary"></el-icon>
    </preview>
    <preview name="size: 72" span="6">
      <el-icon name="i-workstations-o--24" size="72" color="brand-primary"></el-icon>
    </preview>
    <preview name="size: 96" span="6">
      <el-icon name="i-workstations-o--24" size="96" color="brand-primary"></el-icon>
    </preview>
  </preview-group>
</template>

<script setup>
import ElIcon from 'packages/icon';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
</script>