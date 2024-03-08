<template>
  
      <preview-group class="qa-password-basic">
        <preview name="Default" span="8" align-items="stretch">
          <el-password
            v-model="password"
            label="Password"
          >
          </el-password>
        </preview>
        <preview name="With icon default hide" span="8" align-items="stretch">
          <el-password
            v-model="password"
            label="Password"
            with-icon
          >
          </el-password>
        </preview>
        <preview name="With icon default show" span="8" align-items="stretch">
          <el-password
            v-model="password"
            label="Password"
            with-icon
            default-type="text"
          >
          </el-password>
        </preview>
        <preview name="With description" span="8" align-items="stretch">
          <el-password
            v-model="password"
            label="Password"
            description="Must contain at least 5 characters"
          >
          </el-password>
        </preview>
        <preview name="When error" span="8" align-items="stretch">
          <el-password
            v-model="password"
            label="Password"
            description="Must contain at least 5 characters"
            is-error
          >
          </el-password>
        </preview>
      </preview-group>
    
</template>

<script setup>
import { ref } from 'vue';

import ElPassword from 'packages/password';

import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const password = ref('passwd');
</script>
