<script setup>
  import { AcvFittedActions } from '@acronis-platform/ui-component-library';
  import { testActions } from './fitted.actions.mocks.js';

  const actions = [testActions[0]];
</script>

<template>
  <div class="example">
    <AcvFittedActions
      class="example__component"
      :actions="actions"
    />
  </div>
</template>

<style scoped>
.example {
  background-color: var(--acv-color-primary-light);
  border:1px solid var(--acv-color-lightest);
  padding: 16px 0;
  overflow: hidden;

  .example__component {
    font-variant-numeric: tabular-nums;
    font-family: var(--acv-font-family-mono)
  }
}
</style>
