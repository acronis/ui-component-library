<script lang="ts" setup>
  import { computed, inject, onBeforeMount, ref, watch } from 'vue';
  import type { AcvTabsInjection } from '../tabs/tabs.ts';
  import { TABS_KEY } from '../tabs/tabs.ts';
  import type { AcvTabProps, AcvTabSlots } from './tab.ts';

  /**
   * Tab will be used to create a tab element.
   *
   * @displayName Tab component
   */
  defineOptions({ name: 'AcvTab' });
  const props = defineProps<AcvTabProps>();
  defineSlots<AcvTabSlots>();
  const tabName = ref(props.label);
  const isActive = ref(false);

  const tabsState: AcvTabsInjection = inject(TABS_KEY, {});

  watch(
    () => tabsState.selectedTab,
    () => {
      isActive.value = tabName.value === tabsState.selectedTab;
    }
  );

  onBeforeMount(() => {
    if (tabsState.count != null && !tabName.value) {
      tabName.value = tabsState.count;
    }
    if (tabsState.count) {
      tabsState.count++;
    }
    else {
      tabsState.count = 1;
    }

    tabsState.addTab(tabName.value);
    isActive.value = props.name === tabsState.selectedTab;
  });

  const tabClasses = computed(() => ({
    tab: true,
    active: isActive.value,
    disabled: props.disabled
  }));

  defineExpose({ tabName, isActive });
</script>

<template>
  <div
    :class="tabClasses"
  >
    <slot name="prepend">
      <i
        v-if="props.icon"
        :class="props.icon"
      />
    </slot>
    <span
      v-if="props.label"
      class="label"
    >{{ props.label }}</span>
    <slot name="append">
      <i
        v-if="props.appendIcon"
        :class="props.appendIcon"
      />
    </slot>
  </div>
</template>

<style scoped>
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
    pointer-events: none;
    opacity: .5;
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

  .label {
    white-space: nowrap;
    text-transform: capitalize;
  }
}
</style>
