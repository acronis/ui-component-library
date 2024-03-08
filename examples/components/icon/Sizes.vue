<template>
  <preview-group class="qa-icon-sizes">
    <preview name="16" span="6">
      <el-icon name="i-workstations-o--16" color="brand-primary"></el-icon>
    </preview>
    <preview name="24" span="6">
      <el-icon name="i-workstations-o--24" color="brand-primary"></el-icon>
    </preview>
    <preview name="32" span="6">
      <el-icon name="i-workstations-o--32" color="brand-primary"></el-icon>
    </preview>
  </preview-group>
</template>

<script setup>
import ElIcon from 'packages/icon';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
</script>