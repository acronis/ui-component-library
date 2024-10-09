<script setup>
  import Column from '@/components/column/column.vue';
  import Row from '@/components/row/row.vue';
</script>

<template>
  <Row
    class="qa-grid-layout-column-spacing"
    :gutter="16"
  >
    <Column :span="6">
      <div class="grid-content bg-brand-light" />
    </Column>
    <Column :span="6">
      <div class="grid-content bg-brand-light" />
    </Column>
    <Column :span="6">
      <div class="grid-content bg-brand-light" />
    </Column>
    <Column :span="6">
      <div class="grid-content bg-brand-light" />
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
