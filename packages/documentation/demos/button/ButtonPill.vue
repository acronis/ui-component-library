<script setup>
  import Row from '@/components/row/row.vue';
  import AcvButton from '@/components/button/button.vue';
</script>

<template>
  <Row gutter="24">
    <AcvButton
      pill
      variant="primary"
    >
      Primary
    </AcvButton>
    <AcvButton
      pill
      color="secondary"
    >
      Secondary
    </AcvButton>
    <AcvButton
      pill
      variant="success"
    >
      Success
    </AcvButton>
    <AcvButton
      pill
      variant="danger"
    >
      Danger
    </AcvButton>
    <AcvButton
      pill
      variant="warning"
    >
      Warning
    </AcvButton>
    <AcvButton
      pill
      variant="info"
    >
      Info
    </AcvButton>
    <AcvButton
      pill
      variant="inverted"
    >
      Inverted
    </AcvButton>
  </Row>
</template>

<style scoped>
.acv-button {
  margin-inline: 10px;
}
</style>
