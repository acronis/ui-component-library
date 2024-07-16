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
  <div class="acv-bg-nav-primary px-8">
    <AcvButton type="inverted">
      Inverted
    </AcvButton>
  </div>
</template>

<style scoped>
.acv-button {
  margin-block: 8px;
  width: 100%;
}
</style>
