<script setup>
  import AcvButton from '@/components/button/button.vue';
  import Grid from '@/components/grid/grid.vue';
  import Cell from '@/components/cell/cell.vue';

  const buttonStates = [
    '',
    'hover',
    'active',
    'focus',
    'disabled'
  ];
</script>

<template>
  <Grid :gap="32">
    <Cell
      v-for="state in buttonStates"
      :key="state"
      :width="3"
      align="center"
    >
      <AcvButton
        :class="state"
        variant="danger"
      >
        Button solid {{ state }}
      </AcvButton>
      <AcvButton
        :class="state"
        outline
        variant="danger"
      >
        Button outline  {{ state }}
      </AcvButton>
      <AcvButton
        :class="state"
        ghost
        variant="danger"
      >
        Button ghost {{ state }}
      </AcvButton>
    </Cell>
  </Grid>
</template>

<style scoped>
.acv-cell {
  padding-block: 16px;
  padding-inline: 16px;
}

.acv-button {
  margin-block: 10px;
  width: 100%;
}
</style>
