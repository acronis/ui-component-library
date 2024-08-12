<script setup lang="ts">
  import { computed, provide, ref, toRef } from 'vue';
  import type { AcvTabsEvents, AcvTabsProps, AcvTabsSlots } from './tabs.ts';
  import { TABS_KEY } from './tabs.ts';
  import './tabs.css';
  import AcvTab from '@/components/tab/tab.vue';
  import type { AcvTabProps } from '@/components/tab/tab.ts';
  import { useSelection } from '@/composables/useSelection.ts';

  /**
   * Tabs are the set of content sections(tab panels), that display one panel at the time.
   * Each tab panel associated with tab element, when activated, displays the panel.
   * List of tab elements, arranged along one edge of a tab panel container.
   *
   * @displayName Tabs component
   */
  defineOptions({ name: 'AcvTabs' });
  const props = defineProps<AcvTabsProps>();
  const emit = defineEmits<AcvTabsEvents>();
  defineSlots<AcvTabsSlots>();

  const tabsRef = ref<AcvTabsProps[]>([]);

  const modelOptions = computed(() => {
    if (!props.tabs?.length)
      return [];

    return props.tabs.map(tab => typeof tab === 'string' ? tab : (tab as AcvTabProps).value);
  });
  const { options, select: selectTab, value: activeTab } = useSelection({
    items: modelOptions.value,
    initialValue: toRef(() => {
      return props.modelValue || modelOptions.value[0];
    }),
  });
  function handleTabClick(tabIndex: number) {
    const value = options.value[tabIndex]?.value;

    selectTab(value);

    emit('update:modelValue', value);
  }
  provide(TABS_KEY, activeTab);

  const navClasses = computed(() => ({
    nav: true,
    large: props.size === 'large',
    spaced: props.spacing
  }));
</script>

<template>
  <div class="acv-tabs">
    <nav
      class="nav"
      :class="navClasses"
    >
      <slot name="tabs">
        <AcvTab
          v-for="(tab, i) in props.tabs"
          :key="i"
          ref="tabsRef"
          v-bind="typeof tab === 'string' ? { label: tab } : tab"
          :class="{
            active: tab === activeTab,
          }"
          :disabled="typeof tab === 'object' && tab.disabled"
          @click="handleTabClick(i)"
        />
      </slot>
    </nav>
    <div
      v-for="(tab, i) in options"
      :key="i"
      class="panel"
    >
      <div
        v-show="i === activeTab"
        class="tab"
      >
        <slot
          :name="tab.value"
        />
      </div>
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
        height: 48px;
        line-height: calc(var(--acv-font-line-height-x-large) - (2 * var(--acv-border-width-small)));
      }

      &.spaced {
        margin: 24px 24px 0;
      }
    }

    .tab {
      align-items: center;
      background-color: transparent;
      border-right: var(--acv-border-small) var(--acv-color-primary);
      color: var(--acv-color-primary);
      cursor: pointer;
      display: flex;
      flex: 1;
      font-size: var(--acv-font-size-body);
      font-weight: var(--acv-font-weight-strong);
      height: 100%;
      justify-content: center;
      line-height: inherit;
      min-width: 0;
      outline: none;
      padding: 0 16px;
      position: relative;

      &.active {
        background-color: var(--acv-color-primary-lightest);
        color: var(--acv-color-black);
      }

      &.disabled {
        color: var(--acv-color-disabled,  rgb(36 49 67 / .7));
        cursor: default;
      }

      &:-moz-focusring {
        outline: none;
      }

      &:first-child {
        border-radius: var(--acv-border-radius-small) 0 0 var(--acv-border-radius-small);
      }

      &.is-focus:focus:not(:active) {
        outline: none;
        overflow: visible;

        &:before {
          content: '';
          border: var(--acv-border-width-large) solid var(--acv-color-status-focus);
          border-width: 3px 0;
          position: absolute;
          inset: -4px 0;
          box-sizing: content-box;
        }

        &:first-child:before {
          border-width: var(--acv-border-width-large) 0 var(--acv-border-width-large) var(--acv-border-width-large);
          left: -4px;
          border-radius: var(--acv-tabs-border-radius) 0 0 var(--acv-tabs-border-radius);
        }

        &:last-child:before {
          border-width: var(--acv-border-width-large) var(--acv-border-width-large) var(--acv-border-width-large) 0;
          right: -4px;
          border-radius: 0 var(--acv-tabs-border-radius) var(--acv-tabs-border-radius) 0;
        }
      }

      &:hover {
        background-color: var(--acv-color-primary-hover);
        cursor: pointer;
      }

      &:active {
        background-color: var(--acv-color-primary-active);
      }
    }

    .tab:last-child {
      border: 0;
      border-radius: 0 var(--acv-border-radius-small) var(--acv-border-radius-small) var(--acv-border-radius-small) 0;
    }
  }
</style>
