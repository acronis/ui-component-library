<template>
  <div class="demo-dialog">
    <el-button @click="showDialog = true">Wrap Content</el-button>
    <el-dialog
      variant="clean"
      width-size="medium"
      height-size="fixed-auto"
      v-model:visible="showDialog">
      <div class="clean-content-wrapper">
        <div class="image-skeleton">
        </div>
        <div class="max-width-464px">
          <div class="mt-24 mb-8 el-text--display-medium">
            The headline is better to fix the width of 464 pixels, it does not prevent it from being written in two-three lines
          </div>
          <div class="mb-24 el-text--body-24">
            Enter the registration code that appears on your appliance display.
          </div>
        </div>
        <el-button size="large">Button with action</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import ElButton from 'packages/button';
import ElDialog from 'packages/dialog';
import { ref } from 'vue';

const showDialog = ref(false);
</script>

<style lang="scss" scoped>
  .demo-dialog {

    .el-dialog__wrapper {
      margin: 0;
    }

    .image-skeleton {
      height: 96px;
      width: 96px;
      border-radius: 8px;
      background-color: #2668c5;
      opacity: .3;
    }

    .clean-content-wrapper {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    $sizes: 384px, 464px, 624px;
    @each $width in $sizes {
      .max-width-#{$width} {
        max-width: $width;
      }
    }
  }
</style>
