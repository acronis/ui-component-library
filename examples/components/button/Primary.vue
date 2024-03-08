<template>
  <preview-group class="qa-button-primary">
    <preview name="Default" span="6">
      <el-button>Button</el-button>
    </preview>
    <preview name="With icon" span="6">
      <el-button icon="i-plus--16">Button</el-button>
    </preview>
    <preview name="Only icon in slot" span="6">
      <el-button>
        <el-icon name="i-plus--16"></el-icon>
      </el-button>
    </preview>
    <preview name="Only icon in prop" span="6">
      <el-button icon="i-plus--16"></el-button>
    </preview>
    <preview name="Fluid Height: 32" span="6">
      <el-button fluid>Button</el-button>
    </preview>
    <preview name="Fluid Height: 48" span="6">
      <el-button fluid height="48">Button</el-button>
    </preview>
    <preview name="empty string" span="6">
      <el-button icon="i-plus--16">
        {{ primaryEmpty }}
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

  const primaryEmpty = ref('');
</script>

