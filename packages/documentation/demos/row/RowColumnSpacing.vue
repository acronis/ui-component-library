<script setup>
  import Row from '@/components/row/row.vue';
  import Column from '@/components/column/column.vue';
</script>

<template>
  <Row
    class="qa-grid-layout-column-spacing"
    :gutter="16"
  >
    <Column :span="6">
      <div class="grid-content bg-brand-light"></div>
    </Column>
    <Column :span="6">
      <div class="grid-content bg-brand-light"></div>
    </Column>
    <Column :span="6">
      <div class="grid-content bg-brand-light"></div>
    </Column>
    <Column :span="6">
      <div class="grid-content bg-brand-light"></div>
    </Column>
  </Row>
</template>

<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    height: 100%;
  }

  .bg-brand-light {
    background-color: var(--acv-color-primary-lighter);
  }
</style>
