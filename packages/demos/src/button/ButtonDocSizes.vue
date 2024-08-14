<script setup>
  import AcvButton from '@/components/button/button.vue';
  </script>

<template>
  <div class="acv-grid-row acv-grid--cols-2">
    <AcvButton>
      Default button
    </AcvButton>
    <AcvButton size="large">
      Large button
    </AcvButton>
    <AcvButton variant="outline">
      Default button
    </AcvButton>
    <AcvButton
      variant="outline"
      size="large"
    >
      Large button
    </AcvButton>
  </div>
</template>
