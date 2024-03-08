<template>
  <preview-group class="qa-icon-disabled">
    <preview name="Default" span="6">
      <el-icon name="i-workstations-o--16" color="brand-primary" disabled></el-icon>
    </preview>
    <preview name="Ghost button" span="6">
      <el-button type="ghost" disabled><el-icon name="i-workstations-o--16"/></el-button>
    </preview>
    <preview name="Secondary button" span="6">
      <el-button type="secondary" icon="i-workstations-o--16" disabled>Button</el-button>
    </preview>
    <preview name="Primary button" span="6">
      <el-button icon="i-workstations-o--16" disabled>Button</el-button>
    </preview>
  </preview-group>
</template>

<script setup>
import ElIcon from 'packages/icon';
import ElButton from 'packages/button';

import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
</script>
