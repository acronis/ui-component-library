<template>
  <el-button @click="dialogMinimalHeightVisible = true">
    Minimal Height
  </el-button>
  <el-dialog
    v-model:visible="dialogMinimalHeightVisible"
    width-size="small"
    height-size="fixed-auto"
    title="Lorem ipsum dolor sit amet, consectetur adipisicing elit and do it. Autem commodi deleniti dolorem dolorum eligendi"
  >
    <div class="px-24 py-16">
      <div>
        <div class="el-text el-text--size-xs">
          Minimal Height
        </div>
      </div>
    </div>
    <template #footer-aside>
      <span class="el-text el-text--body-24">Lorem ipsum dolor sit amet, consectetur adipisicing elit. </span>
    </template>
    <template #footer>
      <el-button
        type="secondary"
        @click="dialogMinimalHeightVisible = false"
      >
        Cancel
      </el-button>
      <el-button @click="dialogMinimalHeightVisible = false">
        Ok
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import ElButton from 'packages/button';
import ElDialog from 'packages/dialog';
import { ref } from 'vue';

const dialogMinimalHeightVisible = ref(false);
</script>
