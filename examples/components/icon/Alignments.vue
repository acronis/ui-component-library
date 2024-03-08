<template>
  <preview-group class="qa-icon-alignment">
    <preview span="24" name="Flex">
      <div v-for="font in fonts" :key="font" style="width: 100%;">
        <div class="icon-text-layout-container flex align-center el-text" :class="font.toLowerCase()">
          <el-icon name="i-trash-o--16" class="with-background mx-8"></el-icon>
          <el-icon name="i-plus--16" class="with-background mr-8"></el-icon>
          <el-icon name="i-image-template-o--24" class="with-background mr-8"></el-icon>
          <el-icon name="i-plus--24" class="with-background mr-16"></el-icon>
          <el-icon name="i-local-backup-o--32" class="with-background mr-16"></el-icon>
          <el-icon name="i-times--32" class="with-background mr-16"></el-icon>
          <span>{{ font }}</span>
          <el-icon name="i-times--32" class="with-background ml-16"></el-icon>
          <el-icon name="i-local-backup-o--32" class="with-background ml-16"></el-icon>
          <el-icon name="i-plus--24" class="with-background ml-16"></el-icon>
          <el-icon name="i-image-template-o--24" class="with-background ml-8"></el-icon>
          <el-icon name="i-plus--16" class="with-background ml-8"></el-icon>
          <el-icon name="i-trash-o--16" class="with-background mx-8"></el-icon>
        </div>
      </div>
    </preview>
  </preview-group>
</template>

<script setup>
import { ref } from 'vue';
import ElIcon from 'packages/icon';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

const fonts = ref([
  'el-text--display-large',
  'el-text--display-medium',
  'el-text--display-regular',
  'EL-TEXT--HEADING',
  'el-text--subheading',
  'el-text--body-24',
  'el-text--caption',
  'EL-TEXT--ACCENT'
]);
</script>

<style lang="scss" scoped>
  @import 'themes/acronis/src/common/variables';

  .icon-text-layout-container {
    margin: 8px;
    white-space: nowrap;
  }

  .flex {
    display:flex;
  }

  .align-center {
    align-items: center;
  }

  .with-background {
    background: $av-fixed-lightest;
  }
</style>
