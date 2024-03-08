<template>
  <div class="qa-input-textarea-autosize">
    <preview-group>
      <preview name="Default" span="8" align-items="stretch">
        <el-input
          type="number"
          v-model.number="number1"
          label="Number"
        />
      </preview>
      <preview name="With min, max, step and placeholder" span="8" align-items="stretch">
        <el-input
          type="number"
          v-model.number="number2"
          min="-100"
          max="100"
          step="2"
          label="Number"
          :debounce-process-number="600"
          placeholder="Type number"
        />
      </preview>
      <preview name="With precision" span="8" align-items="stretch">
        <el-input
          type="number"
          v-model.number="number3"
          :precision="1"
          label="Number"
        />
      </preview>
    </preview-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import ElInput from 'packages/input';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const number1 = ref('');
const number2 = ref('');
const number3 = ref('');
</script>
