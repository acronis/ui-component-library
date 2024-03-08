<template>
  <preview-group class="qa-secondary-states">
    <preview name="Default" span="6">
      <el-button type="secondary">Default</el-button>
    </preview>
    <preview name="Hover" span="6">
      <el-button class="is-hover" type="secondary">Hover</el-button>
    </preview>
    <preview name="Active" span="6">
      <el-button class="is-active" type="secondary">Active</el-button>
    </preview>
    <preview name="Focus" span="6">
      <el-button class="is-focus" type="secondary">Focus</el-button>
    </preview>
    <preview name="Disabled" span="6">
      <el-button class="is-disabled" type="secondary">Disabled</el-button>
    </preview>
    <preview name="Loading" span="6">
      <el-button class="is-loading" loading type="secondary">Loading</el-button>
    </preview>
    <preview name="Selected" span="6">
      <el-button class="is-selected" type="secondary">Selected</el-button>
    </preview>
  </preview-group>
</template>

<script setup>
  import { ref } from 'vue';
  import ElButton from 'packages/button';
  import PreviewGroup from 'examples/components/preview-group.vue';
  import Preview from 'examples/components/preview.vue';

  const secondaryEmpty = ref('');
</script>
