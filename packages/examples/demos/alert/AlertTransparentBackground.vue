<script setup>
  import AcvAlert from '@/components/alert/alert.vue';
</script>

<template>
  <div class="bg-brand-lighter py-24 px-24">
    <AcvAlert
      type="info"
      description="Alert has solid background color by default. Use transparent to change its background to transparent color and produce the background color overlapping effect"
      transparent
      show-icon
      hide-close
    />
  </div>
</template>
