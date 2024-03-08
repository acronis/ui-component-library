<template>
  <div class="bg-brand-lighter py-24 px-24">
    <el-alert
      type="info"
      description="Alert has solid background color by default. Use transparent to change its background to transparent color and produce the background color overlapping effect"
      transparent
      show-icon
      hide-close
    >
    </el-alert>
  </div>
</template>
<script setup>
import ElAlert from 'packages/alert';
</script>

<style lang="scss" scoped>
@import 'themes/acronis/src/common/variables/colors';

.el-alert {
  margin-top: 16px;

  &:first-child {
    margin-top: 0;
  }
}

.bg-brand-lighter {
  background-color: $av-brand-light;
}
</style>