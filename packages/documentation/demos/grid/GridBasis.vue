 <script setup>
  import Grid from '@/components/grid/grid.vue';
  import Cell from '@/components/cell/cell.vue';
</script>

<template>
  <Grid :gap="8">
    <Cell>
      <div class="content">
        width-24
      </div>
    </Cell>
  </Grid>
  <br />
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
  border-radius: var(--acv-radius-02);
}
</style>
