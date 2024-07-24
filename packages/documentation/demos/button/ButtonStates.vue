<script setup>
  import { IconAcronisIcon32 } from '@acronis-platform/icons/acronis';
  import { BUTTON_COLOR } from '@/components/button/button.ts';
  import Button from '@/components/button/button.vue';
  import Grid from '@/components/grid/grid.vue';
  import Cell from '@/components/cell/cell.vue';

  const buttonColors = [
    'primary',
    'secondary',
    'ghost',
    'inverted',
    'danger'
  ];
</script>

<template>
  <Grid :gap="32">
    <Cell
      v-for="color in buttonColors"
      :key="color"
      align="center"
      :width="8"
      :class="{
        'acv-bg-nav-primary': color === BUTTON_COLOR.inverted,
      }"
    >
      <Button :color="color">
        <template #icon>
          <IconAcronisIcon32
            style="width:16px; height:16px;vertical-align: text-bottom;"
          />
        </template>
        Default {{ color }}
      </Button>
      <Button
        :color="color"
        class="hover"
      >
        Hover
      </Button>
      <Button
        :color="color"
        class="active"
      >
        Active
      </Button>
      <Button
        :color="color"
        class="focus"
      >
        Focus
      </Button>
      <Button
        :color="color"
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
