<template>
  <preview-group class="qa-button-ghost-states">
    <preview name="Default" span="6">
      <el-button type="ghost">Default</el-button>
    </preview>
    <preview name="Hover" span="6">
      <el-button class="is-hover" type="ghost">Hover</el-button>
    </preview>
    <preview name="Active" span="6">
      <el-button class="is-active" type="ghost">Active</el-button>
    </preview>
    <preview name="Focus" span="6">
      <el-button class="is-focus" type="ghost">Focus</el-button>
    </preview>
    <preview name="Disabled" span="6">
      <el-button class="is-disabled" type="ghost">Disabled</el-button>
    </preview>
    <preview name="Loading" span="6">
      <el-button class="is-loading" loading type="ghost">Loading</el-button>
    </preview>
    <preview name="Selected" span="6">
      <el-button class="is-selected" type="ghost">Selected</el-button>
    </preview>
  </preview-group>
</template>

<script setup>
  import ElButton from 'packages/button';
  import PreviewGroup from 'examples/components/preview-group.vue';
  import Preview from 'examples/components/preview.vue';
</script>
