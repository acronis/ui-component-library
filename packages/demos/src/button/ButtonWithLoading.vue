<script setup>
  import { ref } from 'vue';
  import Button from '@/components/button/button.vue';
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';
  import Row from '@/components/row/row.vue';

  const isLoading = ref(true);
</script>

<template>
  <Row gutter="24">
    <AcvCheckbox v-model="isLoading">
      Toggle loading
    </AcvCheckbox>
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
