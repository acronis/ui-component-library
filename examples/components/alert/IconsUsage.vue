<template>
  <div class="qa-alert-basic">
    <el-alert
      type="info"
      icon="clr-pending--16"
      description="This is a description."
      show-icon
      @close="onClose">
    </el-alert>
    <el-alert
      type="success"
      icon="clr-upsell--16"
      description="This is a description."
      show-icon
      @close="onClose">
    </el-alert>
    <el-alert
      type="warning"
      icon="clr-dot-warning--16"
      description="This is a description."
      show-icon
      @close="onClose">
    </el-alert>
    <el-alert
      type="critical"
      icon="clr-dot-critical--16"
      description="This is a description."
      show-icon
      @close="onClose">
    </el-alert>
    <el-alert
      type="error"
      icon="clr-stop--16"
      description="This is a description."
      show-icon
      @close="onClose">
    </el-alert>
    <el-alert
      type="unknown"
      icon="clr-pause--16"
      description="This is a description."
      show-icon
      @close="onClose">
    </el-alert>
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