<script setup>
  import Container from '@/components/container/container.vue';
</script>

<template>
  <Container
    color="primary"
    class="acv-text--color-inversed-primary"
  >
    primary
  </Container>
  <Container color="secondary">
    secondary
  </Container>
  <Container color="tertiary">
    tertiary
  </Container>
  <Container color="white">
    white
  </Container>
  <Container color="success">
    success
  </Container>
  <Container color="warning">
    warning
  </Container>
  <Container color="danger">
    danger
  </Container>
  <Container color="info">
    Info
  </Container>
  <Container color="disabled">
    disabled
  </Container>
  <Container color="accent">
    accent
  </Container>
  <Container color="critical">
    critical
  </Container>
  <Container color="wrong">
    wrong
  </Container>
  <Container color="#f00">
    #f00
  </Container>
</template>

<style scoped>
.acv-container {
  margin: 10px;
  padding-inline: 8px;
  border-radius: 5px;
  border: 1px solid hsl(0deg 0% 80%);
  color: hsl(0deg 0% 20%);
  font-size: var(--acv-base-font-size-14);
  text-transform: capitalize;
  line-height: 24px;
  box-sizing: border-box;
}
</style>
