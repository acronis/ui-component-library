<script setup>
  import Row from '@/components/row/row.vue';
  import Column from '@/components/column/column.vue';
</script>

<template>
  <div class="qa-grid-layout-column-offset">
    <Row :gutter="16">
      <Column :span="6">
        <div class="grid-content bg-brand-light"></div>
      </Column>
      <Column
        :span="6"
        :offset="6"
      >
        <div class="grid-content bg-brand-light"></div>
      </Column>
    </Row>
    <Row :gutter="16">
      <Column
        :span="6"
        :offset="6"
      >
        <div class="grid-content bg-brand-light"></div>
      </Column>
      <Column
        :span="6"
        :offset="6"
      >
        <div class="grid-content bg-brand-light"></div>
      </Column>
    </Row>
    <Row :gutter="16">
      <Column
        :span="12"
        :offset="6"
      >
        <div class="grid-content bg-brand-light"></div>
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
