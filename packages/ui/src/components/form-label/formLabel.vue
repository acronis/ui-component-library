<script setup lang="ts">
  import { computed } from 'vue';
  import type {
    AcvFormLabelProps,
    AcvFormLabelSlots
  } from './formLabel.ts';
  import './formLabel.css';

  const { label, placement = 'right', description } = defineProps<AcvFormLabelProps>();

  defineSlots<AcvFormLabelSlots>();

  const labelClasses = computed(() => {
    return {
      'acv-form-label': true,
      [placement as string]: placement
    };
  });
</script>

<template>
  <label :class="labelClasses">
    <slot name="label">
      <span
        v-if="label"
        class="title"
      >
        {{ label }}
      </span>
    </slot>
    <slot name="description">
      <span
        v-if="description"
        class="description"
      >
        {{ description }}
      </span>
    </slot>

    <slot />
  </label>
</template>

<style scoped>
  .acv-form-label {
    align-items: normal;
    color: var(--acv-form-label-color);
    cursor: pointer;
    display: inline-flex;
    flex-wrap: nowrap;
    font-family: var(--acv-font-family-default), sans-serif;
    font-size: var(--acv-font-size-body);
    font-weight: var(--acv-font-weight-strong);
    line-height: var(--acv-font-line-height-regular);
    gap: 8px;
    font-style: normal;

    &.top {
      flex-direction: column;
    }

    &.bottom {
      flex-direction: column-reverse;
    }

    &.left {
      flex-direction: row;
    }

    &.right {
      flex-direction: row-reverse;
    }

    .title {
      color: var(--acv-color-text-primary, hsl(215deg 30% 20%));
      font-weight: var(--acv-font-weight-accent);
    }

    .description {
      color: var(--acv-color-text-secondary, rgb(36 49 67 / 0.70));
      font-weight: var(--acv-font-weight-regular);
    }
  }
</style>
