<script setup>
  import AcvButton from '@/components/button/button.vue';
</script>

<template>
  <AcvButton variant="primary">
    Primary
  </AcvButton>
  <AcvButton variant="secondary">
    Secondary
  </AcvButton>
  <AcvButton variant="ghost">
    Ghost
  </AcvButton>
  <AcvButton variant="status">
    Danger
  </AcvButton>
  <div
    class="dark"
  >
    <AcvButton variant="inverted">
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
