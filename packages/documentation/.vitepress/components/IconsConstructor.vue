<script setup lang="ts">
  import * as constructorIcons from '@acronis-platform/icons/src/constructor';
  import Icons from './Icons.vue';
</script>

<template>
  <Icons :icons="Object.keys(constructorIcons)"></Icons>
</template>

<style scoped></style>
