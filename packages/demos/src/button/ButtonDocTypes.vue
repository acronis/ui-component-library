<script setup>
  import AcvButton from '@/components/button/button.vue';
</script>

<template>
  <AcvButton type="primary">
    Primary
  </AcvButton>
  <AcvButton type="secondary">
    Secondary
  </AcvButton>
  <AcvButton type="ghost">
    Ghost
  </AcvButton>
  <AcvButton type="danger">
    Danger
  </AcvButton>
  <div
    class="dark"
  >
    <AcvButton type="inverted">
      Inverted
    </AcvButton>
  </div>
</template>

<style scoped>
.acv-button {
  margin-block: 8px;
  margin-inline: 8px;
}

.dark {
  background-color: var(--acv-color-nav-primary);
  padding-inline: 8px;
  display: inline-flex
}
</style>
