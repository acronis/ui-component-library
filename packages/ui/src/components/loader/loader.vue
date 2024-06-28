<script setup lang="ts">
  import { ref } from 'vue';
  import './loader.css';

  const text = ref('Loader');
</script>

<template>
  <div class="acv-loader">
    {{ text }}
  </div>
</template>

<style scoped>
.acv-loader {
  color: var(--acv-loader-color);
}
</style>
