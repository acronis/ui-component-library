<script setup lang="ts">
  import type {
    AcvBreadcrumbItemProps,
    AcvBreadcrumbItemSlots,
    AcvBreadcrumbLinkEvents
  } from './breadcrumbs.ts';
  import { vAutofocus } from '@/directives/autofocus.ts';

  import { computed } from 'vue';
  import AcvBreadcrumbLink from './breadcrumbLink.vue';

  const props = defineProps<AcvBreadcrumbItemProps>();
  const emit = defineEmits<AcvBreadcrumbLinkEvents>();
  defineSlots<AcvBreadcrumbItemSlots>();

  const classes = computed(() => ({
    'is-active': props.active,
  }));

  function handleClick(to: string | Record<string, unknown>) {
    console.log(to);
    emit('click', to);
  }

  function handleEnterKeyDownTriggerClick() {
    handleClick(props.to);
  }
</script>

<template>
  <div
    class="acv-breadcrumb-item"
    :class="classes"
    tabindex="0"
    @keydown.enter="handleEnterKeyDownTriggerClick"
  >
    <AcvBreadcrumbLink
      v-autofocus="true"
      :to="to"
      :active="active"
      @click="handleClick"
    >
      <slot name="icon" />
      <slot />
    </AcvBreadcrumbLink>
  </div>
</template>

<style scoped>
</style>
