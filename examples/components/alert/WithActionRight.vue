<template>
  <div class="qa-alert-actions-right">
    <el-alert
      type="info"
      title="With title"
      description="This is a description.">
      <template v-slot:actions-right>
        <el-button type="ghost">Actions right</el-button>
      </template>
    </el-alert>
    <el-alert
      type="info"
      title="With title"
      description="This is a description.">
      <template v-slot:actions-right>
        <el-button type="primary">Actions right</el-button>
      </template>
    </el-alert>
  </div>
</template>
<script setup>
import ElAlert from 'packages/alert';
import ElButton from 'packages/button';
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