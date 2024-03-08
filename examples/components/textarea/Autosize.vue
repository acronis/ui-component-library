<template>
  <div class="qa-input-textarea-autosize">
    <preview-group>
      <preview name="Default" span="10" align-items="stretch" justify-content="flex-start">
        <el-input
          v-model="textarea1"
          label="Label"
          type="textarea"
          class="pt-8"
          autosize
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

const textarea1 = ref('');
</script>
