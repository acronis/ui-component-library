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
    <AcvButton variant="secondary">
      Default button
    </AcvButton>
    <AcvButton
      variant="secondary"
      size="large"
    >
      Large button
    </AcvButton>
  </div>
</template>

<style scoped>
  .acv-grid-row{
    display: grid;
    width: 100%;
    place-items: start;
    grid-gap: 1.5rem;
    gap: 1.5rem;
  }

  .acv-grid--cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
</style>
