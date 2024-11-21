<script setup lang="ts">
  import type { AcvTabPaneProps } from './tab-pane.ts';
  import { TABS_KEY } from '@/components/tabs/public.ts';
  import { computed, inject, onBeforeMount, onUnmounted, ref, watch } from 'vue';

  defineOptions({
    name: 'AcvTabPane'
  });

  const props = defineProps<AcvTabPaneProps>();
  const isActive = ref(false);
  const index = ref<number>(0);
  const tabs = inject(TABS_KEY, { count: 0, selectedIndex: 0 });

  watch(
    () => tabs.selectedIndex,
    () => {
      isActive.value = index.value === tabs.selectedIndex;
    }
  );

  onBeforeMount(() => {
    if (tabs.count !== undefined) {
      index.value = tabs.count;
      tabs.count++;
      isActive.value = index.value === tabs.selectedIndex;
    }
  });

  onUnmounted(() => {
    if (tabs.count !== undefined) {
      tabs.count--;
    }
  });

  const paneName = computed(() => {
    return props.name || index.value;
  });
</script>

<template>
  <div
    v-show="isActive"
    :id="`pane-${paneName}`"
    class="acv-tab-pane"
    role="tabpanel"
    :aria-hidden="!isActive"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot />
  </div>
</template>
