<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { IMoon, ISun } from '@acronis-platform/icons';
  import { isClient } from '@acronis-platform/utils';

  const rootCls = isClient ? document.documentElement.classList : undefined;
  const dark = ref(false);

  onMounted(() => {
    dark.value = !!rootCls && rootCls.contains('dark');
  });

  function toggleDark(value: boolean) {
    if (!isClient || !rootCls) {
      return;
    }

    requestAnimationFrame(() => {
      dark.value = value;

      if (value) {
        rootCls.add('dark');
      }
      else {
        rootCls.remove('dark');
      }

      localStorage.setItem('uikit-docs-theme-prefer-dark', String(value));
    });
  }
</script>

<template>
  <Switch
    :value="dark"
    class="theme-switch"
    :open-icon="IMoon"
    :close-icon="ISun"
    aria-label="theme"
    @change="toggleDark"
  ></Switch>
</template>

<style lang="css">
.theme-switch {
  border: 1px solid var(--acv-color-brand-primary);

  html.dark & {
    --acv-switch-bg-color-open: var(--acv-color-brand-tertiary);
    --acv-switch-signal-bg-color: hsl(0deg, 0%, 0%);
    --acv-switch-icon-color: var(--acv-color-brand-secondary);
  }
}
</style>
