<template>
  <preview-group class="qa-button-sizes">
    <preview name="Small" span="8">
      <el-button size="small">Button</el-button>
    </preview>
    <preview name="Default" span="8">
      <el-button>Button</el-button>
    </preview>
    <preview name="Large" span="8">
      <el-button size="large">Button</el-button>
    </preview>
  </preview-group>
</template>

<script setup>
  import ElButton from 'packages/button';
  import PreviewGroup from 'examples/components/preview-group.vue';
  import Preview from 'examples/components/preview.vue';

</script>
