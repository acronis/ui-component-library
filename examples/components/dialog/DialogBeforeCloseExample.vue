<template>
  <div class="qa-dialog-before-close-button">
    <el-button @click="dialogVisible = true">
      Click me
    </el-button>
  </div>

  <div class="qa-dialog-before-close">
    <el-dialog
      v-model:visible="dialogVisible"
      title="Tips"
      height-size="fixed-auto"
      :before-close="handleClose"
    >
      <div class="px-24 py-16">
        This is a message
      </div>
      <template #footer>
        <el-button
          type="secondary"
          @click="dialogVisible = false"
        >
          Cancel
        </el-button>
        <el-button @click="dialogVisible = false">
          Confirm
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import ElButton from 'packages/button';
import ElDialog from 'packages/dialog';
import { ref } from 'vue';

const dialogVisible = ref(false);
const handleClose = (done) => {
  const result = confirm('Are you sure to close this dialog?');
  if (result) {
    done();
  }
};
</script>
