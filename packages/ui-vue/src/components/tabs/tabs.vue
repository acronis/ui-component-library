<script setup lang="ts">
  import type { VNode } from 'vue';
  import type { AcvTabsEvents, AcvTabsProps } from './tabs';
  import AcvDivider from '@/components/divider/divider.vue';
  import { nextTick, onBeforeMount, onMounted, provide, reactive, ref, useSlots, watch } from 'vue';
  import TabNav from './tab-nav.vue';
  import { TABS_KEY } from './tabs';

  /**
   * Tabs are the set of content sections(tab panels), that display one panel at the time.
   * Each tab panel associated with tab element, when activated, displays the panel.
   * List of tab elements, arranged along one edge of a tab panel container.
   *
   * @displayName Tabs component
   */
  defineOptions({
    name: 'AcvTabs',
  });

  const props = withDefaults(defineProps<AcvTabsProps>(), {
    large: false,
    showDivider: true,
    spacing: true
  });

  const emit = defineEmits<AcvTabsEvents>();

  const state = reactive({
    count: 0,
    selectedIndex: 0,
    currentName: props.modelValue,
  });
  const nav = ref<InstanceType<typeof TabNav> | null>(null);
  const tabs = ref<VNode[]>([]);
  const slots = useSlots();

  onBeforeMount(() => {
    setTabs();
  });

  onMounted(() => {
    selectTab(0);
  });

  function selectTab(index: number) {
    state.selectedIndex = index;
    nav.value?.reFocus();
  }

  function setTabs() {
    if (slots.default) {
      const defaultSlot = slots.default();
      const rootElement = Array.isArray(defaultSlot) && defaultSlot.length === 1 && defaultSlot[0].children
        ? defaultSlot[0].children as VNode[]
        : defaultSlot as VNode[];

      tabs.value = rootElement.filter(tab => (tab.type as any).name === 'AcvTabPane');
    }
  }

  function handleTabClick(index, name) {
    emit('update:modelValue', name);
    if (props.modelValue !== undefined) {
      return;
    }
    selectTab(index);
  }

  provide(TABS_KEY, state);

  watch(() => state.count, (value) => {
    setTabs();

    if (value === state.selectedIndex) {
      selectTab(0);
    }
  });

  watch(() => props.modelValue, async (value) => {
    await nextTick();
    const nextIndex = tabs.value.findIndex(tab => (tab as any).props.name === value);
    if (nextIndex === -1) {
      return;
    }
    state.selectedIndex = nextIndex;
    state.currentName = value;
  }, {
    immediate: true,
  });
</script>

<template>
  <div class="acv-tabs">
    <TabNav
      ref="nav"
      :current-index="state.selectedIndex"
      :tabs="tabs"
      :large="props.large"
      :spacing="props.spacing"
      @tab-click="handleTabClick"
    >
      <template
        #default
      >
        <slot />
      </template>
    </TabNav>

    <div class="acv-tabs__content">
      <AcvDivider
        v-if="showDivider"
        class="mt-24"
      />
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .acv-tabs {
    --acv-divider-v-margin: 0;
    font-family: var(--acv-font-family-default), sans-serif;
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-tabs-color);
    width: 100%;

    .acv-tabs__content {
        overflow: hidden;
        position: relative;
    }
  }
</style>
