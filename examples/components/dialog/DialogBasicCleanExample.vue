<template>
  <preview-group>
    <preview
      name="variant='clean-basic'"
      span="6"
    >
      <div class="demo-dialog">
        <el-button @click="showDialog = true">
          Basic clean
        </el-button>
        <el-dialog
          v-model:visible="showDialog"
          variant="clean-basic"
          width-size="small"
          height-size="fixed-auto"
        >
          <div
            class="clean-content-wrapper"
            style="padding: 80px 64px 64px 64px;"
          >
            <div
              class="image-skeleton"
              style="width: 384px; height: 272px;"
            />
            <div class="max-width-304px">
              <div class="mt-24 mb-8 el-text--display-medium">
                The headline is better to have maximum width of 304 pixels
              </div>
              <div class="mb-24 el-text--body-24">
                Enter the registration code that appears on your appliance display.
              </div>
            </div>
          </div>
        </el-dialog>
      </div>
    </preview>
  </preview-group>
</template>

<script setup>
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

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
