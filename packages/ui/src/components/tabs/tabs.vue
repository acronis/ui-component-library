<script setup lang="ts">
  import { onBeforeMount, onMounted, provide, reactive, toRefs } from 'vue';
  import type { VNode } from 'vue';
  import type {
    AcvTabsEvents,
    AcvTabsProps,
    AcvTabsSlots
  } from './tabs.ts';
  import {
    TABS_KEY
  } from './tabs.ts';
  import './tabs.css';

  defineOptions({ name: 'AcvTabs' });
  defineProps<AcvTabsProps>();
  defineEmits<AcvTabsEvents>();

  const slots = defineSlots<AcvTabsSlots>();

  const state = reactive({
    selectedIndex: 0,
    tabs: [] as VNode[],
    count: 0
  });

  provide(TABS_KEY, state);

  function selectTab(i: number) {
    state.selectedIndex = i;
  }

  onBeforeMount(() => {
    if (slots.default) {
      state.tabs = slots.default().filter(child => child.type.name === 'AcvTab');
    }
  });

  onMounted(() => {
    selectTab(0);
  });

  defineExpose({ ...toRefs(state), selectTab });
</script>

<template>
  <div class="acv-tabs">
    <div class="header">
      <div
        v-for="(tab, index) in state.tabs"
        :key="index"
        :class="{ selected: index === state.selectedIndex }"
        class="tab"
        @click="selectTab(index)"
      >
        {{ tab.props?.title }}
      </div>
    </div>
    <slot />
  </div>
</template>

<style scoped>
  .acv-tabs {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-tabs-color);

    .header {
      display: flex;
      border-bottom: 1px solid var(--acv-color-primary-lightest);

      .tab {
        margin-inline-end: 16px;
        padding-inline: 8px;
        cursor: pointer;

        &.selected {
          background-color: var(--acv-color-primary-lightest);
          color: var(--acv-color-white);
        }
      }
    }
  }
</style>
