<script setup lang="ts">
  import * as acronisIcons from '@acronis-platform/icons/src/acronis';
  import Icons from './Icons.vue';
</script>

<template>
  <Icons :icons="Object.keys(acronisIcons)"></Icons>
</template>

<style scoped></style>
