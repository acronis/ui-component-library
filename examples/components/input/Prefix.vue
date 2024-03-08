<template>
  
      <div class="qa-input-mask">
        <preview-group>
          <preview name="Business phone" span="8" align-items="stretch">
            <el-input
              v-model="inputPrefixValue"
              label="Business phone"
              prefix-value="+"
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

const inputPrefixValue = ref('');
</script>