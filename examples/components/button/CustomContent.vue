<template>
  <preview-group class="qa-button-custom-content">
    <preview name="Custom content" span="6">
      <el-button @click='handleClick'>
        Button
        <el-icon :name="customIcon" class="ml-8" color="fixed-white"></el-icon>
      </el-button>
    </preview>
    <preview name="Long label text with Icon" span="8">
      <el-button show-hover-hint>
        <div class="custom-content-button-wrapper">
          <div class="custom-content-button"> Long label text button with Icon</div>
          <el-icon class="ml-8" color="fixed-white" name="i-workstations-o--16"></el-icon>
        </div>
      </el-button>
    </preview>
  </preview-group>
</template>

<script setup>
  import { ref } from 'vue';
  import ElButton from 'packages/button';
  import ElIcon from 'packages/icon';
  import PreviewGroup from 'examples/components/preview-group.vue';
  import Preview from 'examples/components/preview.vue';

  const customIcon = ref('i-chevron-up--16');
  const handleClick = () => {
    this.customIcon = this.customIcon === 'i-chevron-up--16'
      ? 'i-chevron-down--16'
      : 'i-chevron-up--16';
  }
</script>

<style lang="scss">
  .custom-content-button-wrapper {
    display: flex;
    align-items: center;
  }

  .custom-content-button {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
