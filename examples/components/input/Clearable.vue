<template>
  
      <div class="qa-input-clearable">
        <el-input
          v-model="input1"
          label="Label"
          clearable
        />
      </div>
    
</template>

<script setup>
import { ref } from 'vue';

import ElInput from 'packages/input';


const input1 = ref('');
</script>