<script setup>
  import Container from '@/components/container/container.vue';
</script>

<template>
  <Container
    color="primary"
    class="acv-text--color-inversed-primary"
  >
    <span>Default</span>
  </Container>
  <Container
    color="primary"
    class="acv-text--color-inversed-primary"
    xs
  >
    <span>100% wide until Extra Small breakpoint</span>
  </Container>
  <Container
    color="primary"
    class="acv-text--color-inversed-primary"
    sm
  >
    <span>100% wide until Small breakpoint</span>
  </Container>
  <Container
    color="primary"
    class="acv-text--color-inversed-primary"
    md
  >
    <span>100% wide until Medium breakpoint</span>
  </Container>
  <Container
    color="primary"
    class="acv-text--color-inversed-primary"
    lg
  >
    <span>100% wide until Large breakpoint</span>
  </Container>
  <Container
    color="primary"
    class="acv-text--color-inversed-primary"
    xl
  >
    <span>100% wide until Extra Large breakpoint</span>
  </Container>
  <Container
    color="primary"
    class="acv-text--color-inversed-primary"
    xxl
  >
    <span>100% wide until Extra Extra Large breakpoint</span>
  </Container>
</template>

<style scoped>
@container style(--is-x-small-viewport: true) {
  .acv-container-xs  {
    background-color: var(--acv-color-status-danger-primary) !important;
  }
}

@container style(--is-small-viewport: true) {
  .acv-container-sm  {
    background-color: var(--acv-color-status-danger-primary) !important;
  }
}

@container style(--is-medium-viewport: true) {
  .acv-container-md  {
    background-color: var(--acv-color-status-danger-primary) !important;
  }
}

@container style(--is-large-viewport: true) {
  .acv-container-lg {
    background-color: var(--acv-color-status-danger-primary) !important;
  }
}

@container style(--is-x-large-viewport: true) {
  .acv-container-xl {
    background-color: var(--acv-color-status-danger-primary) !important;
  }
}

@container style(--is-xx-large-viewport: true) {
  .acv-container-xxl {
    background-color: var(--acv-color-status-danger-primary) !important;
  }
}

@container (max-width: 500px) {
  span {
    background-color: var(--acv-color-highlight) !important;
  }
}
</style>
