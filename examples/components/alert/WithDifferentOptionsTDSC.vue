<template>
    <div class="qa-alert-action">
      <el-alert
        :content="{
          title: 'Troubleshoot',
          texts: ['Alert has solid background color by default. Use transparent to change its background to transparent color and produce the background color overlapping effect']
        }"
        type="error"
        title="This is title"
        description="This is a description."
        subtitle="Error code XXX"
        show-icon
        hide-close
        >
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
