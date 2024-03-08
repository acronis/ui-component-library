<template>
  <div>
    <el-alert
      type="info"
      advanced
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