<script setup>
  import AcvButton from '@/components/button/button.vue';
</script>

<template>
  <AcvButton type="button">
    Button
  </AcvButton>
  <AcvButton type="submit">
    Submit
  </AcvButton>
  <AcvButton type="reset">
    Reset
  </AcvButton>
  <AcvButton
    type="link"
    href="#"
  >
    Link
  </AcvButton>
  <AcvButton
    type="route"
    to="#"
  >
    Router link
  </AcvButton>
</template>

<style scoped>
  .acv-button {
    margin-right: 8px;
  }
</style>
