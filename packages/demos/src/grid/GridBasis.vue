 <script setup>
  import Cell from '@/components/cell/cell.vue';
  import Grid from '@/components/grid/grid.vue';
</script>

<template>
  <Grid :gap="8">
    <Cell>
      <div class="content">
        width-24
      </div>
    </Cell>
  </Grid>
  <Grid
    :gap="8"
    :columns="24"
  >
    <Cell :width="12">
      <div class="content">
        width-12
      </div>
    </Cell>
    <Cell :width="12">
      <div class="content">
        width-12
      </div>
    </Cell>
  </Grid>
</template>

<style scoped>
.content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 48px;
  color: var(--acv-color-white);
  background-color: var(--acv-color-brand-primary);
  border-radius: var(--acv-radius-small);
}
</style>
