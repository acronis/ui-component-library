<script>
  import { FittedActions } from '@acronis-platform/ui-component-library';
  import { testActions } from './fitted.actions.mocks';

  export default {
    name: 'FittedActionsBasic',
    components: {
      FittedActions
    },
    data() {
      return {
        testActions
      };
    }
  };
</script>

<template>
  <div class="example">
    <FittedActions
      class="example__component"
      :actions="testActions"
    />
  </div>
</template>

<style scoped>
.example {
  background-color: var(--acv-color-brand-primary);
  border:1px solid var(--acv-color-fixed-lightest);
  padding: 16px 0;
  overflow: hidden;

  .example__component {
    font-variant-numeric: tabular-nums;
    font-family: var(--acv-font-family-mono);
  }
}
</style>
