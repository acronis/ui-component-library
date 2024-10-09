<script setup lang="ts">
  import type {
    AcvOptionEvents,
    AcvOptionProps,
    AcvOptionSlots
  } from './option.ts';
  import { computed } from 'vue';
  import './option.css';

  defineOptions({ name: 'AcvOption' });

  const props = defineProps<AcvOptionProps>();

  defineEmits<AcvOptionEvents>();
  defineSlots<AcvOptionSlots>();

  const optionClasses = computed(() => {
    return {
      'acv-option': true,
      'selected': props.selected,
      'active': props.active
    };
  });
</script>

<template>
  <div
    :class="optionClasses"
    role="option"
    :aria-selected="props.selected"
    :aria-disabled="props.disabled"
  >
    <slot>{{ props.label }}</slot>
  </div>
</template>

<style scoped>
  .acv-option {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-option-color);
    position: relative;
    padding-inline: 16px;
    padding-block: 8px;
    min-width: 260px;
    height: 40px;

    &.selected {
      padding-left: 40px;
    }

    &.selected:before {
      content: "✓";
      position: absolute;
      left: 0.8rem;
    }

    &:not(:last-of-type):after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-bottom: 1px solid hsl(0deg 0% 83%);
    }

    &.hover,
    &:hover {
      background-color: var(--acv-color-primary-lightest);
      color: var(--acv-color-white);
      cursor: default;
    }

    &.active,
    &:active {
      background-color: var(--acv-color-primary);
      color: var(--acv-color-white);
      cursor: default;
    }
  }
</style>
