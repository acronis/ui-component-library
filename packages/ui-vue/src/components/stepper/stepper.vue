<script setup lang="ts"></script>

<template>
  <div class="acv-stepper">
    <slot />
  </div>
</template>

<style scoped>
  .acv-stepper {
    display: flex;
    flex-direction: column;
  }
</style>
