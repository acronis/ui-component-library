<script setup>
  import AcvButton from '@/components/button/button.vue';
  import Row from '@/components/row/row.vue';
</script>

<template>
  <Row
    :gap="16"
    :columns="3"
  >
    <AcvButton
      squared
      color="primary"
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
      color="success"
    >
      Success
    </AcvButton>

    <AcvButton
      squared
      color="danger"
    >
      Danger
    </AcvButton>
    <AcvButton
      squared
      color="warning"
    >
      Warning
    </AcvButton>
    <AcvButton
      squared
      color="info"
    >
      Info
    </AcvButton>
    <AcvButton
      squared
      color="inverted"
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
