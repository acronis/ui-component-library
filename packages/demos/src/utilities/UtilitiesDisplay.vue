<template>
  <div class="acv-display--block">
    ... acv-display--block ...
  </div>

  <div class="acv-display--inline-block">
    acv-display--inline-block
  </div>

  <div class="acv-display--flex">
    acv-display--flex
  </div>

  <div class="acv-display--inline-flex">
    acv-display--inline-flex
  </div>

  <div class="acv-display--inline">
    acv-display--inline
  </div>

  <div class="acv-display--none">
    acv-display--none
  </div>
</template>

<style scoped>
[class^="acv-display--"] {
  background-color: var(--acv-color-status-danger-secondary);
  width: 50px;
  height: 50px;
}
</style>
