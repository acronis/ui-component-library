<script setup>
  import Container from '@/components/container/container.vue';
</script>

<template>
  <Container
    color="primary"
    class="acv-text--color-inversed-primary mb-24"
    direction="vertical"
  >
    <span>Vertical</span>
    <span>Vertical 1</span>
    <span>Vertical 2</span>
  </Container>
  <Container
    color="primary"
    class="acv-text--color-inversed-primary"
    direction="horizontal"
  >
    <span>Horizontal</span>
    <span>Horizontal 1</span>
    <span>Horizontal 2</span>
  </Container>
</template>

<style scoped>
span {
  padding: 8px;
  background-color: hsl(0deg 53% 58%);
  border-radius: 4px;
  margin-block: 8px;
  margin-inline: 8px;
}
</style>
