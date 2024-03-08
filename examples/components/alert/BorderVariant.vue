<template>
  <preview-group class="qa-alert-border-variant">
    <preview span="24" name="No border" align-items='stretch'>
      <el-alert
        type="info"
        description="This is a description."
        show-icon
        @close="onClose"
      >
      </el-alert>
    </preview>
    <preview span="24" name="Top and bottom borders" align-items='stretch'>
      <el-alert
        type="info"
        description="This is a description."
        show-icon
        border
        @close="onClose"
      >
      </el-alert>
      <el-alert
        type="info"
        description="This is a description."
        show-icon
        :border="{top:true, bottom:true}"
        @close="onClose"
      >
      </el-alert>
    </preview>
    <preview span="24" name="Only top border" align-items='stretch'>
      <el-alert
        type="info"
        description="This is a description."
        show-icon
        :border="{top:true}"
        @close="onClose"
      >
      </el-alert>
    </preview>
    <preview span="24" name="Only bottom border" align-items='stretch'>
      <el-alert
        type="info"
        description="This is a description."
        show-icon
        :border="{bottom:true}"
        @close="onClose"
      >
      </el-alert>
    </preview>
  </preview-group>
</template>

<script setup>
import ElAlert from 'packages/alert';
import PreviewGroup from 'examples/components/preview-group.vue';
import Preview from 'examples/components/preview.vue';

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