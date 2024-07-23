<script lang="ts" setup>
  import { inject, onBeforeMount, ref, watch } from 'vue';
  import type { AcvTabsInjection } from './tabs.ts';
  import { TABS_KEY } from './tabs.ts';

  defineOptions({ name: 'AcvTab' });

  const index = ref(0);
  const isActive = ref(false);

  const tabsState: AcvTabsInjection = inject(TABS_KEY, {});

  watch(
    () => tabsState.selectedIndex,
    () => {
      isActive.value = index.value === tabsState.selectedIndex;
    }
  );

  onBeforeMount(() => {
    if (tabsState.count != null) {
      index.value = tabsState.count;
    }
    if (tabsState.count) {
      tabsState.count++;
    }
    else {
      tabsState.count = 1;
    }
    isActive.value = index.value === tabsState.selectedIndex;
  });

  defineExpose({ index, isActive });
</script>

<template>
  <div
    v-show="isActive"
    class="tab"
  >
    <slot />
  </div>
</template>
