<script lang="ts" setup>
  import { computed } from 'vue';

  defineOptions({ name: 'CheckboxIcon' });

  const props = defineProps({
    checked: Boolean,
    indeterminate: Boolean,
    disabled: Boolean,
    invalid: Boolean,
    size: String,
    color: String,
  });

  const checkboxClasses = computed(() => {
    return {
      'acv-checkbox-icon': true,
      'checked': props.checked,
      'indeterminate': props.indeterminate,
      'disabled': props.disabled,
      'invalid': props.invalid,
      [props.size as string]: props.size,
    };
  });
</script>

<template>
  <svg
    :class="checkboxClasses"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="{ '--acv-checkbox-icon-color': `var(--acv-color-${props.color})` }"
  >
    <rect
      class="outline"
      x="0.5"
      y="0.5"
      width="15"
      height="15"
      rx="3.5"
      stroke-width="1"
      stroke="currentcolor"
    />
    <rect
      v-if="props.checked || props.indeterminate"
      class="background"
      width="16"
      height="16"
      rx="3.5"
      stroke-width="1"
      fill="currentcolor"
    />
    <rect
      v-if="props.indeterminate"
      class="minus"
      x="4"
      y="7"
      width="8"
      height="2"
      fill="white"
    />
    <path
      v-if="props.checked"
      class="check"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.70787140302658,4 L12.92857140302658,5.2583400000000005 L6.388811403026581,12 L2.928571403026581,8.43296 L4.149221403026581,7.17458 L6.388811403026581,9.48332 z"
      fill="white"
    />
  </svg>
</template>

<style scoped>
.acv-checkbox-icon {
  --acv-checkbox-icon-color: var(--acv-color-form-secondary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 2px;
  color: var(--acv-checkbox-icon-color);
  width: 1em;
  height: 1em;
  font-size: var(--acv-font-size-accent);

  &.small {
    font-size: var(--acv-font-size-body)
  }

  &.large {
    font-size: var(--acv-font-size-lead)
  }

  &.checked,
  &.indeterminate,
  &:checked,
  &.hover,
  &:hover {
    --acv-checkbox-icon-color: var(--acv-color-form-hover)
  }

  &.active,
  &:active {
    --acv-checkbox-icon-color: var(--acv-color-form-active)
  }

  &.focus,
  &:focus {
    outline: var(--acv-color-form-focus) var(--acv-border-style-solid) var(--acv-border-large);
    border-radius: 4px;
  }

  &.invalid {
    outline: var(--acv-color-form-error) var(--acv-border-style-solid) var(--acv-border-large);
    border-radius: 4px;
  }

  &.disabled {
    --acv-checkbox-icon-color: var(--acv-color-form-disabled-primary);

    .background {
      fill: var(--acv-color-form-disabled-primary);
    }

    .outline {
      stroke: var(--acv-color-form-disabled-secondary);
    }

    .minus,
    .check {
      fill: var(--acv-color-icon-disabled);
    }
  }
}
</style>
