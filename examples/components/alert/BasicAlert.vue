<template>
  <div class="qa-alert-basic">
    <el-alert
      type="info"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <el-alert
      type="success"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <el-alert
      type="warning"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <el-alert
      type="critical"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <el-alert
      type="error"
      description="This is a description."
      show-icon
      @close="onClose"
    />
    <el-alert
      type="unknown"
      description="This is a description."
      show-icon
      @close="onClose"
    />
  </div>
</template>

<script setup>
import ElAlert from 'packages/alert';

function onClose() {
  console.log('Alert is closed');
}
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
