<template>
  
      <div class="qa-input-icon">
        <preview-group>
          <preview name="Date" span="8" align-items="stretch">
            <el-input
              v-model="input1"
              label="Date"
              suffix-icon="i-calendar-o--16"
              size="normal"
            />
            </preview>
            <preview name="Search" span="8" align-items="stretch">
            <el-input
              v-model="input1"
              placeholder="Search"
              suffix-icon="i-search-o--16"
              size="small"
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

const input1 = ref('');
</script>