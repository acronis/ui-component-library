<script setup lang="ts">
  import { computed, useAttrs } from 'vue';
  import type {
    CheckboxProps
  } from '../index.ts';
  import {
    IconButton,
    IconCheckbox,
    IconCheckboxIndeterminate,
    IconCheckboxOutline,
    Input
  } from '../index.ts';
  import type { CheckboxEvents, CheckboxSlots } from './checkbox.ts';
  import './checkbox.css';

  defineProps<CheckboxProps>();
  defineEmits<CheckboxEvents>();
  defineSlots<CheckboxSlots>();
  const attrs = useAttrs();

  const checked = defineModel();
  const indeterminate = defineModel('indeterminate');

  const showCheckedIcon = computed<boolean>(() => {
    if (typeof checked.value === 'boolean') {
      return checked.value;
    }
    return (checked.value as any[])?.includes(attrs.value);
  });
</script>

<template>
  <div class="acv-checkbox">
    <IconButton>
      <slot
        name="icon"
        :checked="checked"
      >
        <IconCheckboxIndeterminate v-if="indeterminate" />
        <IconCheckbox v-else-if="showCheckedIcon" />
        <IconCheckboxOutline v-else />
      </slot>
      <Input
        v-bind="$attrs"
        v-model="checked"
        type="checkbox"
      />
    </IconButton>
    <slot></slot>
  </div>
</template>

<style scoped>
  .acv-checkbox {
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-checkbox-color);
    position: relative;

    .acv-input {
      flex: 0 1 auto;
      cursor: inherit;
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      margin: 0;
      padding: 0;
      z-index: var(--acv-z-index-normal);
    }
  }
</style>
