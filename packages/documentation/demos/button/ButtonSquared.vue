<script setup>
  import Row from '@/components/row/row.vue';
  import AcvButton from '@/components/button/button.vue';
</script>

<template>
  <Row
    :gap="16"
    :columns="3"
  >
    <AcvButton
      squared
      variant="primary"
    >
      Primary squared
    </AcvButton>
    <AcvButton
      squared
      color="secondary"
    >
      Secondary
    </AcvButton>
    <AcvButton
      squared
      variant="success"
    >
      Success
    </AcvButton>

    <AcvButton
      squared
      variant="danger"
    >
      Danger
    </AcvButton>
    <AcvButton
      squared
      variant="warning"
    >
      Warning
    </AcvButton>
    <AcvButton
      squared
      variant="info"
    >
      Info
    </AcvButton>
    <AcvButton
      squared
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
