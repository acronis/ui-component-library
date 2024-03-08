<template>
  <div class="qa-alert-action">
    <el-alert
      type="info"
      title="With title"
      description="This is a description.">
      <template v-slot:actions>
        <el-button type="ghost">Action</el-button>
      </template>
    </el-alert>
  </div>
</template>
<script setup>
import ElAlert from 'packages/alert';
import ElButton from 'packages/button';
</script>