<template>
  <preview-group class="qa-button-ghost">
    <preview name="Default" span="6">
      <el-button type="ghost">
        Button
      </el-button>
    </preview>
    <preview name="With icon" span="6">
      <el-button icon="i-plus--16" type="ghost">
        Button
      </el-button>
    </preview>
    <preview name="With right icon" span="6">
      <el-button icon="i-plus--16" right-Icon type="ghost">
        Button
      </el-button>
    </preview>
    <preview name="Only icon in slot" span="6">
      <el-button type="ghost">
        <el-icon name="i-plus--16"></el-icon>
      </el-button>
    </preview>
    <preview name="Only icon in prop" span="6">
      <el-button icon="i-plus--16" type="ghost"></el-button>
    </preview>
    <preview name="empty string" span="6">
      <el-button icon="i-plus--16" type="ghost">
        {{ ghostEmpty }}
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

  const ghostEmpty = ref(null);
</script>
