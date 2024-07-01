<script setup>
  import { IAcronisIconLarge } from '@acronis-platform/icons';
  import Button from '@/components/button/button.vue';
  import Grid from '@/components/grid/grid.vue';
  import Cell from '@/components/cell/cell.vue';

  const buttonVariants = [
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
      v-for="variant in buttonVariants"
      :key="variant"
      align="center"
      :width="8"
      :class="{
        'acv-bg-nav-primary': variant === 'inverted',
      }"
    >
      <Button :variant="variant">
        <template #icon>
          <IAcronisIconLarge
            style="width:16px; height:16px;vertical-align: text-bottom;"
          />
        </template>
        Default {{ variant }}
      </Button>
      <Button
        :variant="variant"
        class="hover"
      >
        Hover
      </Button>
      <Button
        :variant="variant"
        class="active"
      >
        Active
      </Button>
      <Button
        :variant="variant"
        class="focus"
      >
        Focus
      </Button>
      <Button
        :variant="variant"
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
