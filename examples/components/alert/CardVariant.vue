<template>
  <div class="qa-alert-basic">
    <el-alert
      type="info"
      description="This is a description."
      show-icon
      card
      @close="onClose">
    </el-alert>
    <el-alert
      type="info"
      title="With title"
      description="This is a description."
      card
    >
      <template v-slot:actions>
        <el-button type="ghost">Action</el-button>
      </template>
    </el-alert>
  </div>
</template>

<script setup>
import ElAlert from 'packages/alert';
import ElButton from 'packages/button';
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