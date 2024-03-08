<template>
  <preview-group>
    <preview name="Default" span="8">
      <el-tooltip :content="longContent" placement="top">
        <el-icon name="i-info-circle-o--16" color="brand-primary"/>
      </el-tooltip>
    </preview>
    <preview name="Number" span="8">
      <el-tooltip :content="longContent" placement="top" :max-width="500">
        <el-icon name="i-info-circle-o--16" color="brand-primary"/>
      </el-tooltip>
    </preview>
    <preview name="Auto width" span="8">
      <el-tooltip :content="longContent" placement="top" max-width="auto-width">
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
import { ref } from 'vue';

const longContent = ref('Lorem ipsum dolor sit amet, consectet adipisicing elit. '.repeat(10));
</script>
