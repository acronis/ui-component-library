<template>
  <preview-group class="qa-primary-states">
    <preview name="Default" span="6">
      <el-button>Default</el-button>
    </preview>
    <preview name="Hover" span="6">
      <el-button class="is-hover">Hover</el-button>
    </preview>
    <preview name="Active" span="6">
      <el-button class="is-active">Active</el-button>
    </preview>
    <preview name="Focus" span="6">
      <el-button class="is-focus">Focus</el-button>
    </preview>
    <preview name="Disabled" span="6">
      <el-button class="is-disabled">Disabled</el-button>
    </preview>
    <preview name="Loading" span="6">
      <el-button class="is-loading" loading>Loading</el-button>
    </preview>
    <preview name="Selected" span="6">
      <el-button class="is-selected">Selected</el-button>
    </preview>
  </preview-group>
</template>

<script setup>
  import ElButton from 'packages/button';
  import PreviewGroup from 'examples/components/preview-group.vue';
  import Preview from 'examples/components/preview.vue';
</script>
