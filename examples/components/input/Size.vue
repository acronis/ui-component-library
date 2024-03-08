<template>
  
      <div class="qa-input-basic">
        <preview-group>
          <preview name="Default" span="8" align-items="stretch">
          <el-input
            v-model="input1"
            label="Label"
            size="small"
          >
          </el-input>
        </preview>
        <preview name="With placeholder" span="8" align-items="stretch">
          <el-input
            v-model="input2"
            label="Label"
            placeholder="Placeholder"
            size="small"
          >
          </el-input>
        </preview>
        <preview name="With predefined value" span="8" align-items="stretch">
          <el-input
            v-model="input3"
            label="Label"
            placeholder="Placeholder"
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

const input1 = ref('');
const input2 = ref('');
const input3 = ref('Value');
</script>