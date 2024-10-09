<script lang="ts" setup>
  import type { AcvTabsInjection } from '../tabs/tabs.ts';
  import type { AcvTabProps, AcvTabSlots } from './tab.ts';
  import { computed, inject, ref } from 'vue';
  import { TABS_KEY } from '../tabs/tabs.ts';

  /**
   * Tab will be used to create a tab element.
   *
   * @displayName Tab component
   */
  defineOptions({ name: 'AcvTab' });
  const props = defineProps<AcvTabProps>();
  defineSlots<AcvTabSlots>();
  const tabName = ref(props.value || props.label);

  const tabsState: AcvTabsInjection = inject(TABS_KEY, {});
  const tabIsSelected = computed(() => tabsState.selectedTab?.value && (tabsState.selectedTab.value === tabName.value));
  const tabClasses = computed(() => ({
    tab: true,
    active: tabIsSelected.value,
    disabled: props.disabled
  }));
</script>

<template>
  <button
    :class="tabClasses"
    role="tab"
    :aria-selected="!!tabIsSelected"
    :tabindex="tabIsSelected ? 0 : -1"
  >
    <slot name="prepend">
      <component
        :is="props.icon"
        v-if="props.icon"
      />
    </slot>
    <slot>
      <span
        v-if="props.label"
        class="label"
      >{{ props.label }}</span>
    </slot>
    <slot name="append">
      <component
        :is="props.appendIcon"
        v-if="props.appendIcon"
      />
    </slot>
  </button>
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

  &:hover {
    background-color: var(--acv-color-nav-hover-secondary);
    cursor: pointer;
  }

  &:active,
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

  .label {
    white-space: nowrap;
    text-transform: capitalize;
  }

  .acv-icon + .label,
  .label + .acv-icon {
    margin-left: 8px;
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

}
</style>
