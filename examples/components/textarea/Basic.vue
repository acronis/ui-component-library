<template>
  <div class="qa-input-textarea-basic">
    <preview-group>
      <preview name="Default" span="8" align-items="stretch" justify-content="flex-start">
    <el-input
      v-model="textarea1"
      label="Label"
      type="textarea"
      class="pt-8"
    >
    </el-input>
  </preview>
  <preview name="With placeholder" span="8" align-items="stretch" justify-content="flex-start">
    <el-input
      v-model="textarea2"
      label="Label"
      placeholder="Placeholder"
      type="textarea"
      class="pt-8"
    >
    </el-input>
  </preview>
  <preview name="With predefined value" span="8" align-items="stretch" justify-content="flex-start">
    <el-input
      v-model="textarea3"
      label="Label"
      placeholder="Placeholder"
      type="textarea"
      class="pt-8"
    >
    </el-input>
  </preview>
  <preview name="Default" span="8" align-items="stretch">
    <el-input
      v-model="textarea4"
      label="Label"
      type="textarea"
      size="small"
    >
    </el-input>
  </preview>
  <preview name="With placeholder" span="8" align-items="stretch">
    <el-input
      v-model="textarea5"
      label="Label"
      placeholder="Placeholder"
      type="textarea"
      size="small"
    >
    </el-input>
  </preview>
  <preview name="With predefined value" span="8" align-items="stretch">
    <el-input
      v-model="textarea6"
      label="Label"
      placeholder="Placeholder"
      type="textarea"
      size="small"
    >
    </el-input>
  </preview>
    </preview-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import ElInput from 'packages/input';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const textarea1 = ref('');
const textarea2 = ref('');
const textarea3 = ref('Value');
const textarea4 = ref('');
const textarea5 = ref('');
const textarea6 = ref('Value');
</script>
