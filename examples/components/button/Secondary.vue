<template>
  <preview-group class="qa-button-secondary">
    <preview name="Default" span="6">
      <el-button type="secondary">
        Button
      </el-button>
    </preview>
    <preview name="With icon" span="6">
      <el-button icon="i-plus--16" type="secondary">
        Button
      </el-button>
    </preview>
    <preview name="Only icon in slot" span="6">
      <el-button type="secondary">
        <el-icon name="i-plus--16"></el-icon>
      </el-button>
    </preview>
    <preview name="Only icon in prop" span="6">
      <el-button icon="i-plus--16" type="secondary"></el-button>
    </preview>
    <preview name="Small" span="6">
      <el-button size="small" type="secondary">
        <el-icon name="i-ellipsis-h--16"></el-icon>
      </el-button>
    </preview>
    <preview name="Fluid Height: 32" span="6">
      <el-button fluid type="secondary">Button</el-button>
    </preview>
    <preview name="Fluid Height: 48" span="6">
      <el-button fluid height="48" type="secondary">Button</el-button>
    </preview>
    <preview name="empty string" span="6">
      <el-button icon="i-plus--16" type="secondary">
        {{ secondaryEmpty }}
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

  const secondaryEmpty = ref('');
</script>
