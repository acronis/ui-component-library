<script setup>
  import AcvButton from '@/components/button/button.vue';
</script>

<template>
  <AcvButton button-type="button">
    Button
  </AcvButton>
  <AcvButton button-type="submit">
    Submit
  </AcvButton>
  <AcvButton button-type="reset">
    Reset
  </AcvButton>
  <AcvButton
    button-type="link"
    href="#"
  >
    Link
  </AcvButton>
  <AcvButton
    button-type="route"
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
