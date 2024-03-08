<template>
  <preview-group class="qa-switch-basic">
    <preview name="Default" span="6">
      <el-switch v-model="value1">Label</el-switch>
    </preview>
    <preview name="Checked" span="6">
      <el-switch v-model="value2">Label</el-switch>
    </preview>
    <preview name="Label left" span="6">
      <el-switch v-model="value3" reverse>Label</el-switch>
    </preview>
    <preview name="Long label" span="6">
      <el-switch v-model="value4" show-hover-hint>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab corporis deleniti exercitationem natus nihil quasi, repellendus totam unde. Esse, exercitationem
      </el-switch>
    </preview>
  </preview-group>
</template>

<script setup>
import { ref } from 'vue';

import ElSwitch from 'packages/switch';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const value1 = ref(false);
const value2 = ref(true);
const value3 = ref(false);
const value4 = ref(false);
</script>
