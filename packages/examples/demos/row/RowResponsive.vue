<script setup>
  import Column from '@/components/column/column.vue';
  import Row from '@/components/row/row.vue';
</script>

<template>
  <Row
    class="qa-grid-layout-responsive"
    :gutter="16"
  >
    <Column
      :xs="8"
      :sm="6"
      :md="4"
      :lg="3"
      :xl="1"
    >
      <div class="grid-content bg-brand-light" />
    </Column>
    <Column
      :xs="4"
      :sm="6"
      :md="8"
      :lg="9"
      :xl="11"
    >
      <div class="grid-content bg-brand-accent" />
    </Column>
    <Column
      :xs="4"
      :sm="6"
      :md="8"
      :lg="9"
      :xl="11"
    >
      <div class="grid-content bg-brand-light" />
    </Column>
    <Column
      :xs="8"
      :sm="6"
      :md="4"
      :lg="3"
      :xl="1"
    >
      <div class="grid-content bg-brand-accent" />
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

.bg-brand-accent {
  background-color: var(--acv-color-accent);
}
</style>
