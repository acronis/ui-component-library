<script setup>
  import Column from '@/components/column/column.vue';
  import Grid from '@/components/grid/grid.vue';
  import Row from '@/components/row/row.vue';
</script>

<template>
  <Grid class="qa-grid-layout-basic">
    <Row>
      <Column :span="24">
        <div class="grid-content bg-brand-light" />
      </Column>
    </Row>
    <Row>
      <Column :span="12">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="12">
        <div class="grid-content bg-brand-accent" />
      </Column>
    </Row>
    <Row>
      <Column :span="8">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="8">
        <div class="grid-content bg-brand-accent" />
      </Column>
      <Column :span="8">
        <div class="grid-content bg-brand-light" />
      </Column>
    </Row>
    <Row>
      <Column :span="6">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-accent" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="6">
        <div class="grid-content bg-brand-accent" />
      </Column>
    </Row>
    <Row>
      <Column :span="4">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="4">
        <div class="grid-content bg-brand-accent" />
      </Column>
      <Column :span="4">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="4">
        <div class="grid-content bg-brand-accent" />
      </Column>
      <Column :span="4">
        <div class="grid-content bg-brand-light" />
      </Column>
      <Column :span="4">
        <div class="grid-content bg-brand-accent" />
      </Column>
    </Row>
  </Grid>
</template>

<style scoped>
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    height: 100%;
  }

  .bg-brand-light {
    background-color: var(--acv-color-brand-secondary);
  }

  .bg-brand-accent {
    background-color: var(--acv-color-brand-primary);
  }
</style>
