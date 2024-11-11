<script setup>
  import Cell from '@/components/cell/cell.vue';
  import Grid from '@/components/grid/grid.vue';
</script>

<template>
  <Grid
    :gap="16"
    :columns="24"
  >
    <Cell
      v-for="n in 12"
      :key="n"
      :width="6"
    >
      <div class="content">
        width-6
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
