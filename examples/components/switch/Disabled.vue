<template>
  <preview-group class="qa-switch-disabled">
    <preview name="Default" span="6">
      <el-switch v-model="value6" disabled>Label</el-switch>
    </preview>
    <preview name="Checked" span="6">
      <el-switch v-model="value7" disabled>Label</el-switch>
    </preview>
  </preview-group>
</template>

<script setup>
import { ref } from 'vue';

import ElSwitch from 'packages/switch';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const value6 = ref(false);
const value7 = ref(true);
</script>
