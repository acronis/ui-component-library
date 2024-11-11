<script setup>
  import Button from '@/components/button/button.vue';
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import Row from '@/components/row/row.vue';
  import { ref } from 'vue';

  const isLoading = ref(true);
</script>

<template>
  <AcvCheckbox
    v-model="isLoading"
    class="mb-16"
  >
    Toggle loading
  </AcvCheckbox>
  <Row gutter="24">
    <Button
      :loading="isLoading"
    >
      Default button
    </Button>
    <Button
      :loading="isLoading"
      size="large"
    >
      Large button
    </Button>
  </Row>
</template>

<style scoped>
.acv-button {
  &+& {
    margin-left: 16px;
  }
}
</style>
