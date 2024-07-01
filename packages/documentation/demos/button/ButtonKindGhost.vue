<script setup>
  import Grid from '@/components/grid/grid.vue';
  import Row from '@/components/row/row.vue';
  import Cell from '@/components/cell/cell.vue';
  import AcvButton from '@/components/button/button.vue';

  const buttonStates = [
    '',
    'hover',
    'active',
    'focus',
    'disabled'
  ];
</script>

<template>
  <Grid :gap="16">
    <Row
      v-for="state in buttonStates"
      :key="state"
      class="acv-bg-secondary pa-16"
      :gap="16"
    >
      <Cell class="mb-8">
        <AcvButton
          :class="state"
          kind="ghost"
          variant="primary"
        >
          Primary {{ state }}
        </AcvButton>
      </Cell>
      <Cell class="mb-8">
        <AcvButton
          :class="state"
          kind="ghost"
          variant="secondary"
        >
          Secondary
        </AcvButton>
      </Cell>
      <Cell class="mb-8">
        <AcvButton
          :class="state"
          kind="ghost"
          variant="success"
        >
          Success
        </AcvButton>
      </Cell>
      <Cell class="mb-8">
        <AcvButton
          :class="state"
          kind="ghost"
          variant="danger"
        >
          Danger
        </AcvButton>
      </Cell>
      <Cell class="mb-8">
        <AcvButton
          :class="state"
          kind="ghost"
          variant="warning"
        >
          Warning
        </AcvButton>
      </Cell>
      <Cell class="mb-8">
        <AcvButton
          :class="state"
          kind="ghost"
          variant="info"
        >
          Info
        </AcvButton>
      </Cell>
      <Cell class="acv-bg-nav-primary pa-8">
        <AcvButton
          :class="state"
          kind="ghost"
          variant="inverted"
        >
          Inverted
        </AcvButton>
      </Cell>
    </Row>
  </Grid>
</template>
