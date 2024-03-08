<template>
  <preview-group class="qa-switch-sizes">
    <preview name="Small" span="6">
      <el-switch v-model="value8" size="small">Label</el-switch>
    </preview>
    <preview name="Default" span="6">
      <el-switch v-model="value9">Label</el-switch>
    </preview>
  </preview-group>
</template>

<script setup>
import { ref } from 'vue';

import ElSwitch from 'packages/switch';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const value8 = ref(true);
const value9 = ref(true);
</script>
