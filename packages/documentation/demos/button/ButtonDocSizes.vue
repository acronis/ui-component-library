<script setup>
  import Row from '@/components/row/row.vue';
</script>

<template>
  <Row
    justify="center"
    :gap="16"
  >
    <AcvButton>
      Default AcvButton
    </AcvButton>
    <AcvButton size="large">
      Large AcvButton
    </AcvButton>
  </Row>
  <Row
    justify="center"
    :gap="16"
  >
    <AcvButton variant="outline">
      Default AcvButton
    </AcvButton>
    <AcvButton
      variant="outline"
      size="large"
    >
      Large AcvButton
    </AcvButton>
  </Row>
</template>
