<script setup lang="ts">
  import type { AcvBreadcrumbLinkEvents, AcvBreadcrumbLinkProps, AcvBreadcrumbLinkSlots } from './breadcrumbs.ts';
  import { computed } from 'vue';

  const props = defineProps<AcvBreadcrumbLinkProps>();
  const emit = defineEmits<AcvBreadcrumbLinkEvents>();
  defineSlots<AcvBreadcrumbLinkSlots>();

  const isExternalLink = computed(() => {
    return typeof props.to === 'string' && props.to.startsWith('http');
  });

  function handleClick() {
    emit('click', props.to);
  }
</script>

<template>
  <a
    v-if="isExternalLink"
    v-bind="$attrs"
    :href="props.to as string"
    target="_blank"
    class="acv-breadcrumbs-link"
  >
    <slot />
  </a>
  <router-link
    v-else
    v-bind="$props"
    custom
    class="acv-breadcrumbs-link"
    :class="{
      'is-active': props.active,
    }"
    :to="props.to"
    @click="handleClick"
  >
    <slot />
  </router-link>
</template>

<style scoped>
.acv-breadcrumbs-link {
  display: flex;
  align-items: center;
  gap: 8px;
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
    background-color: var(--acv-color-button-hover-secondary);
  }

  &:active {
    color: var(--acv-link-color-active);
    background-color: var(--acv-color-button-active-secondary);
  }

  &:focus {
    background-color: var(--acv-color-button-focus);
  }

  &:not(:disabled):active,
  &:not(:disabled).is-active {
    background: var(--acv-color-button-active-secondary);
  }

  &:not(:disabled).is-selected {
    background-color: var(--acv-color-button-active-secondary);
  }

  &:disabled {
    cursor: default;
    pointer-events: none;
  }
}
</style>
