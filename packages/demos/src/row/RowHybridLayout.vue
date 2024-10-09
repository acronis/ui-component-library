<script setup>
  import Column from '@/components/column/column.vue';
  import Row from '@/components/row/row.vue';
</script>

<template>
  <div class="qa-grid-layout-hybrid-layout">
    <Row :gutter="16">
      <Column :span="16">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="8">
        <div class="grid-content bg-brand-light" />
      </Column>
    </Row>
    <Row :gutter="16">
      <Column :span="8">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="8">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="4">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="4">
        <div class="grid-content bg-brand-light" />
      </Column>
    </Row>
    <Row :gutter="16">
      <Column :span="4">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="16">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="4">
        <div class="grid-content bg-brand-light" />
      </Column>
    </Row>
  </div>
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
