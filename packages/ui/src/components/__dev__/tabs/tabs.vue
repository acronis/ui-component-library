<script setup lang="ts">
  import type { AcvTabProps } from '@/components/__dev__/tab/tab.ts';
  import type { AcvTabsEvents, AcvTabsProps, AcvTabsSlots } from '@/components/__dev__/tabs/tabs.ts';
  import type { Ref } from 'vue';
  import AcvTab from '@/components/__dev__/tab/tab.vue';
  import { TABS_KEY } from '@/components/__dev__/tabs/tabs.ts';
  import { useSelection } from '@/composables/useSelection.ts';
  import { computed, provide, ref, toRef } from 'vue';
  import '@/components/__dev__/tabs/tabs.css';

  /**
   * Tabs are the set of content sections(tab panels), that display one panel at the time.
   * Each tab panel associated with tab element, when activated, displays the panel.
   * List of tab elements, arranged along one edge of a tab panel container.
   *
   * @displayName Tabs component
   */
  defineOptions({ name: 'AcvTabs' });
  const props = defineProps<AcvTabsProps>();
  defineEmits<AcvTabsEvents>();
  defineSlots<AcvTabsSlots>();
  const model = defineModel();
  const tabsRef = ref<AcvTabsProps[]>([]);

  const tabValues = computed(() => {
    if (!props.tabs?.length)
      return [];

    return props.tabs.map(tab => typeof tab === 'string' ? tab : (tab as AcvTabProps).value || (tab as AcvTabProps).label);
  });
  const { options, select: selectTab, value: activeTab } = useSelection({
    items: tabValues.value,
    initialValue: toRef(() => {
      return props.modelValue || tabValues.value[0];
    }),
  });
  function handleTabClick(tabIndex: number) {
    const value = options.value[tabIndex]?.value;

    selectTab(value);
    model.value = value;
  }
  provide(TABS_KEY, { selectedTab: activeTab as Ref<string | number | null> });

  const navClasses = computed(() => ({
    nav: true,
    large: props.size === 'large',
    spaced: props.spacing
  }));
</script>

<template>
  <div class="acv-tabs">
    <nav
      :class="navClasses"
      role="tablist"
    >
      <slot
        name="tabs"
        :handle-tab-click="handleTabClick"
      >
        <AcvTab
          v-for="(tab, index) in props.tabs"
          :key="index"
          ref="tabsRef"
          v-bind="typeof tab === 'string' ? { label: tab } : tab"
          :disabled="typeof tab === 'object' && tab.disabled"
          @click="handleTabClick(index)"
        >
          <slot :name="`tab-${tabValues[index] as string}`" />
        </AcvTab>
      </slot>
    </nav>
    <div
      v-for="(tab, i) in options"
      v-show="tab.value === activeTab"
      :key="i"
      class="panel"
      role="tabpanel"
    >
      <slot
        :name="tab.value as string"
      >
        {{ props.tabs && props.tabs[i] && (props.tabs[i] as AcvTabProps).content }}
      </slot>
    </div>
  </div>
</template>

<style scoped>
  .acv-tabs {
    font-family: var(--acv-font-family-default), sans-serif;
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-tabs-color);
    width: 100%;

    .nav {
      flex-wrap: nowrap;
      display: flex;
      border: var(--acv-border-small) var(--acv-color-primary);
      border-radius: var(--acv-border-radius-small);
      height: 32px;
      box-sizing: border-box;
      line-height: calc(var(--acv-font-line-height-medium) - (2 * var(--acv-border-width-small)));

      &.large {
        --acv-icon-size: var(--acv-icon-size-medium);
        height: 48px;
        line-height: calc(var(--acv-font-line-height-x-large) - (2 * var(--acv-border-width-small)));
      }

      &.spaced {
        margin: 24px 24px 0;
      }
    }

    .tab:last-child {
      border: 0;
      border-radius: 0 var(--acv-border-radius-small) var(--acv-border-radius-small) var(--acv-border-radius-small) 0;
    }
  }
</style>
