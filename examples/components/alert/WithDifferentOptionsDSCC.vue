<template>
    <div class="qa-alert-action">
      <el-alert
        content-block-type="info"
        show-icon
        type="warning"
      >
        <template v-slot:content>
          <div class="el-alert__title el-text el-text--strong">Advice</div>
          <div class="el-text el-text--body-24">
            Alert has solid background color by default. Use transparent to change its background to transparent color and produce the <b>background color overlapping effect</b>
          </div>
        </template>
        <template v-slot:subtitle>Error code <b>XXX</b></template>
        <template v-slot:description>This is a description <b>‘smd://192.168.0.1’</b></template>
        <template v-slot:actions>
          <el-button type="ghost">Action</el-button>
          <el-button type="ghost">Second action</el-button>
        </template>
      </el-alert>
    </div>
</template>

<script setup>
import ElAlert from 'packages/alert';
import ElButton from 'packages/button';
</script>
