<template>
  <el-button @click="dialogAside = true; stepper = 0;">
    Aside with footer
  </el-button>
  <el-dialog
    v-model:visible="dialogAside"
    title="Install patches"
    width-size="large"
    height-size="fixed-medium"
  >
    <template #aside>
      <el-stepper :value="stepper">
        <el-stepper-item>Patches</el-stepper-item>
        <el-stepper-item>Post-install options</el-stepper-item>
      </el-stepper>
    </template>
    <div class="px-24 py-16">
      <div class="el-text el-text--display-regular mb-8">
        Post-install options
      </div>
      <div class="el-text el-text--body-24 mb-16">
        Actions to execute after patches installation
      </div>
    </div>
    <template #footer>
      <el-button
        v-if="stepper !== 0"
        type="secondary"
        @click="stepper > 0 ? --stepper : stepper = 0"
      >
        Back
      </el-button>
      <el-button
        v-if="stepper === 0"
        @click="stepper < 1 ? ++stepper : stepper = 0"
      >
        Next
      </el-button>
      <el-button
        v-else
        @click="dialogAside = false"
      >
        Install patches
      </el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import ElButton from 'packages/button';
import ElDialog from 'packages/dialog';
import ElStepper from 'packages/stepper';
import ElStepperItem from 'packages/stepper-item';

import { ref } from 'vue';

const dialogAside = ref(false);
const stepper = ref(0);
</script>
