<script setup>
  import AcvButton from '@/components/button/button.vue';
  import Row from '@/components/row/row.vue';
</script>

<template>
  <Row gutter="24">
    <AcvButton
      pill
      color="primary"
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
      color="tertiary"
    >
      Tertiary
    </AcvButton>
    <AcvButton
      pill
      color="success"
    >
      Success
    </AcvButton>
    <AcvButton
      pill
      color="danger"
    >
      Danger
    </AcvButton>
    <AcvButton
      pill
      color="warning"
    >
      Warning
    </AcvButton>
    <AcvButton
      pill
      color="info"
    >
      Info
    </AcvButton>
    <AcvButton
      pill
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
