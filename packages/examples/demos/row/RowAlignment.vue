<script setup>
  import Column from '@/components/column/column.vue';
  import Row from '@/components/row/row.vue';
</script>

<template>
  <div class="qa-grid-layout-alignment">
    <Row
      type="flex"
      class="bg-row-brand-lightest"
    >
      <Column :span="6">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-accent" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-light" />
      </Column>
    </Row>
    <Row
      type="flex"
      class="bg-row-brand-lightest"
      justify="center"
    >
      <Column :span="6">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-accent" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-light" />
      </Column>
    </Row>
    <Row
      type="flex"
      class="bg-row-brand-lightest"
      justify="end"
    >
      <Column :span="6">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-accent" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-light" />
      </Column>
    </Row>
    <Row
      type="flex"
      class="bg-row-brand-lightest"
      justify="space-between"
    >
      <Column :span="6">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-accent" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-light" />
      </Column>
    </Row>
    <Row
      type="flex"
      class="bg-row-brand-lightest"
      justify="space-around"
    >
      <Column :span="6">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-accent" />
      </Column>
      <Column :span="6">
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

.bg-brand-accent {
  background-color: var(--acv-color-accent);
}
</style>
