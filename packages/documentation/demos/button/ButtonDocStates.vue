<script setup>
import { BUTTON_TYPE } from '@/components/button/button.ts';
import Button from '@/components/button/button.vue';
import Grid from '@/components/grid/grid.vue';
import Cell from '@/components/cell/cell.vue';

const buttonTypes = [
  'primary',
  'secondary',
  'ghost',
  'danger',
  'inverted',
];
</script>

<template>
  <Grid :gap="32">
    <Cell
      v-for="type in buttonTypes"
      :key="type"
      align="center"
      :width="8"
      :class="{
        'acv-bg-nav-primary': type === BUTTON_TYPE.inverted,
      }"
    >
      <Button :type="type">
        Default {{ type }}
      </Button>
      <Button
        :type="type"
        class="hover"
      >
        Hover
      </Button>
      <Button
        :type="type"
        class="active"
      >
        Active
      </Button>
      <Button
        :type="type"
        class="focus"
      >
        Focus
      </Button>
      <Button
        :type="type"
        disabled
      >
        Disabled
      </Button>
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
