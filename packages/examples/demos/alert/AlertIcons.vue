<script setup>
  import { ALERT_VARIANT } from '@/components/alert/alert.ts';
  import AcvAlert from '@/components/alert/alert.vue';
</script>

<template>
  <div class="acv-grid-row acv-grid--cols-2">
    <AcvAlert
      v-for="color in ALERT_VARIANT"
      :key="color"
      :color="color"
      title="Title"
      description="Description"
      show-icon
    />
  </div>
</template>
