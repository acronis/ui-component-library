<template>
  <div class="qa-alert-custom-content">
    <el-alert
      type="info"
      hide-close
    >
      <template v-slot:title>System message</template>
      <template v-slot:description>
        The system is preparing your report.Your report will be sent to you as soon as it is ready
      </template>
      <template v-slot:actions>
        <el-button type="ghost">Details</el-button>
        <el-button type="ghost">Download log</el-button>
      </template>
    </el-alert>
    <el-alert
      type="info"
      hide-close
      show-icon
    >
      <template v-slot>
        <div style="margin-bottom:20px;">The system is preparing your report.</div>
        <div style="margin-bottom:20px;">Your report will be sent to you as soon as it is ready.</div>
        <div>Thank you</div>
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