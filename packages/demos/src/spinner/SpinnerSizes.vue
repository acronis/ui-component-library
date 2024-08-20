<script setup>
  import Spinner from '@/components/spinner/spinner.vue';
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-4">
    <div class="acv-grid-col">
      <Spinner size="small" />
    </div>
    <div class="acv-grid-col">
      <Spinner size="medium" />
    </div>
    <div class="acv-grid-col">
      <Spinner size="large" />
    </div>
    <div class="acv-grid-col">
      <Spinner size="x-large" />
    </div>
  </div>
</template>
