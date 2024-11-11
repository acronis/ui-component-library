<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvLoading from '@/components/loading/loading.vue';
  import { ref } from 'vue';

  const loading = ref(false);
  const secondaryLoading = ref(false);
  const tertiaryLoading = ref(false);
  const invertedLoading = ref(false);
</script>

<template>
  <AcvButton @click="loading = !loading">
    Show default loading
  </AcvButton>
  <AcvButton @click="secondaryLoading = !secondaryLoading">
    Show secondary loading
  </AcvButton>
  <AcvButton @click="tertiaryLoading = !tertiaryLoading">
    Show tertiary loading
  </AcvButton>
  <AcvButton @click="invertedLoading = !invertedLoading">
    Show inverted loading
  </AcvButton>

  <AcvLoading
    v-model="loading"
    size="x-large"
    fullscreen
    @click="loading = false"
  />
  <AcvLoading
    v-model="secondaryLoading"
    background="secondary"
    size="x-large"
    fullscreen
    @click="secondaryLoading = false"
  />
  <AcvLoading
    v-model="tertiaryLoading"
    background="tertiary"
    size="x-large"
    fullscreen
    @click="tertiaryLoading = false"
  />
  <AcvLoading
    v-model="invertedLoading"
    background="inverted"
    size="x-large"
    fullscreen
    @click="invertedLoading = false"
  />
</template>

<style scoped>
  .acv-button {
    margin:0 8px 8px 0;
  }
</style>
