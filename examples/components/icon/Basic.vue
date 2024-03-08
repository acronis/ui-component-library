<template>
  <preview-group class="qa-icon-basic">
    <preview name="Default" span="6">
      <el-icon name="i-workstations-o--16" color="brand-primary"></el-icon>
    </preview>
    <preview name="Ghost button" span="6">
      <el-button type="ghost"><el-icon name="i-workstations-o--16"/></el-button>
    </preview>
    <preview name="Secondary button" span="6">
      <el-button type="secondary" icon="i-workstations-o--16">Button</el-button>
    </preview>
    <preview name="Primary button" span="6">
      <el-button icon="i-workstations-o--16">Button</el-button>
    </preview>
    <preview name="Multicolor icon" span="6">
      <el-icon name="clr-synced-d--16"></el-icon>
    </preview>
    <preview name="Legacy" span="6">
      <el-icon name="i-workstations-o--16" color="brand-primary" legacy></el-icon>
    </preview>
  </preview-group>
</template>

<script setup>
import ElIcon from 'packages/icon';
import ElButton from 'packages/button';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
</script>