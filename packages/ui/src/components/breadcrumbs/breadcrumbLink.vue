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

<style scoped lang="scss">
@import '../../styles/mixins/typography.scss';

.acv-breadcrumbs-link {
  color: var(--acv-breadcrumbs-color);
  max-inline-size: 212px;
  padding-block: 4px;
  padding-inline: 8px;
  text-decoration: none;
  transition: background-color var(--acv-transition-shortest);
  white-space: nowrap;

  &:hover {
    background: var(--acv-color-overlay-hover);
  }

  @include ellipsis;
  @include link;
  @include borderless-action-state;
}
</style>
