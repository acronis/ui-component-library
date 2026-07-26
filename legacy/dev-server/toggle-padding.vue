<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { isClient } from '@acronis-platform/utils';

  const rootCls = isClient ? document.documentElement.classList : undefined;
  const active = ref(false);

  onMounted(() => {
    active.value = !!rootCls && rootCls.contains('padding');
  });

  function togglePadding(value: boolean) {
    if (!isClient || !rootCls) {
      return;
    }

    requestAnimationFrame(() => {
      active.value = value;

      if (value) {
        rootCls.add('padding');
      }
      else {
        rootCls.remove('padding');
      }

      localStorage.setItem('uikit-ui-dev-prefer-no-padding', String(!value));
    });
  }
</script>

<template>
  <div
    class="toggle-padding"
    :class="[active && 'active']"
    @click="togglePadding(!active)"
  >
    Padding
  </div>
</template>

<style lang="css">
.toggle-padding {
  display: flex;
  align-items: center;
  padding: 2px 10px;
  color: var(--acv-color-text-status-danger);
  cursor: pointer;
  user-select: none;
  background-color: var(--acv-color-status-danger-primary);
  border: 1px solid var(--acv-color-status-danger-secondary);
  border-radius: var(--acv-radius-small);
  transition: var(--acv-transition-color), var(--acv-transition-background),
    var(--acv-transition-border);

  &.active {
    color: var(--acv-color-text-status-success);
    background-color: var(--acv-color-status-success-primary);
    border: 1px solid var(--acv-color-status-success-secondary);
  }
}
</style>
