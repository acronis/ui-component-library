<template>
  <preview-group class="qa-tooltip-basic">
  <preview name="Default" span="6">
    <el-tooltip content="Lorem ipsum dolor sit amet, consectet adipisicing elit." placement="top">
      <el-icon name="i-info-circle-o--16" color="brand-primary"/>
    </el-tooltip>
  </preview>
</preview-group>
</template>

<script setup>
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';
import ElTooltip from 'packages/tooltip';
import ElIcon from 'packages/icon';

</script>
