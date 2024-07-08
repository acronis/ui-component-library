<script setup lang="ts">
  import { ref } from 'vue';
  import { RouterLink } from 'vue-router';
  import { useFocusableTab } from '../../composables/useFocusableTab.ts';
  import type { BreadcrumbLinkProps, BreadcrumbLinkSlots } from './breadcrumbs.ts';

  const {
    to
  } = defineProps<BreadcrumbLinkProps>();

  defineSlots<BreadcrumbLinkSlots>();
  const link = ref(null);
  const {
    active,
    focused,
    onFocus,
    onBlur,
    onEnterKeyDown,
    onEnterKeyUp,
    onMouseDown,
    onMouseUp,
  } = useFocusableTab(link);

  function handleEnterKeyDownTriggerClick() {
    onEnterKeyDown();
  }
</script>

<template>
  <RouterLink
    ref="link"
    class="acv-breadcrumbs-link"
    :class="{
      'is-active': active,
      'is-focus': focused,
    }"
    :to="to"
    @keydown.enter="handleEnterKeyDownTriggerClick"
    @keyup.enter="onEnterKeyUp"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @focus="onFocus"
    @blur="onBlur"
  >
    <slot />
  </RouterLink>
</template>

<style scoped>
.acv-breadcrumbs-link {
  max-inline-size: 212px;
  padding-block: 4px;
  padding-inline: 8px;
  transition: background-color var(--acv-transition-shortest);

  /* ellipsis */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;

  /* link */
  text-decoration: none;
  color: var(--acv-link-color);

  /* borderless-action-state */
  border: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  border-radius: var(--acv-radius-small);
  font-weight: var(--acv-font-weight-accent);

  &:hover {
    color: var(--acv-link-color-hover);
    cursor: pointer;
    background-color: var(--acv-color-button-hover-primary);
  }

  &:active {
    color: var(--acv-link-color-active);
    background-color: var(--acv-color-button-active-primary);
  }

  &:focus {
    background-color: var(--acv-color-button-focus);
  }

  &:not(:disabled):active,
  &:not(:disabled).is-active {
    background: var(--acv-color-button-active-primary);
  }

  &:not(:disabled).is-selected {
    background-color: var(--acv-color-button-active-primary);
  }

  &:disabled {
    cursor: default;
    pointer-events: none;
  }
}
</style>
