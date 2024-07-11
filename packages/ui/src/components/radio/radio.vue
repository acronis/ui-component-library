<script setup lang="ts">
  import { computed, useAttrs } from 'vue';
  import './radio.css';

  import type {
    AcvRadioEvents,
    AcvRadioProps,
    AcvRadioSlots
  } from './radio.ts';

  defineOptions({
    name: 'AcvRadio',
    inheritAttrs: false,
  });
  const props = withDefaults(defineProps<AcvRadioProps>(), {});

  defineEmits<AcvRadioEvents>();
  const slots = defineSlots<AcvRadioSlots>();

  const attrs = useAttrs();

  const checked = defineModel();

  const isChecked = computed(() => checked.value === attrs.value);
  // const isChecked = computed(() => checked.value === String(attrs.value));
  const radioClasses = computed(() => {
    return {
      'acv-radio': true,
      [props.color as string]: props.color,
      [props.size as string]: props.size,
      'invalid': props.invalid,
      'disabled': props.disabled,
      'checked': isChecked.value,
    };
  });

  const iconColor = computed(() => {
    return props.color ? `var(--acv-color-${props.color})` : '';
  });

  const iconFillColor = computed(() => {
    return props.color ? `var(--acv-color-white)` : '';
  });

  const radioId = `acv-radio-${attrs.id || Math.random().toString(36).slice(2, 7)}`;
</script>

<template>
  <label
    :for="radioId"
    :class="[radioClasses, attrs.class]"
  >
    <input
      :id="radioId"
      v-model="checked"
      :name="radioId"
      :value="attrs.value"
      :checked="isChecked"
      :disabled="props.disabled"
      :aria-disabled="props.disabled"
      :aria-invalid="props.invalid"
      class="hidden"
      type="radio"
      role="radio"
    >
    <span class="acv-radio-icon">
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          v-if="isChecked"
          class="selection"
          cx="8"
          cy="8"
          :r="props.disabled ? 3 : 5.5"
          fill="white"
          stroke="currentcolor"
          :stroke-width="props.disabled ? 0 : 5"
        />
        <circle
          v-if="!isChecked || props.disabled"
          class="ring"
          cx="8"
          cy="8"
          r="7.5"
          fill="white"
          stroke="#1F56A2"
        />
      </svg>
    </span>
    <span
      v-if="slots.default || props.label"
      class="px-8"
    >
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<style scoped>
  .acv-radio {
    --acv-radio-icon-stroke-color: v-bind(iconColor);
    --acv-radio-icon-fill-color: v-bind(iconFillColor);
    --acv-radio-icon-ring-stroke: var(--acv-radio-icon-stroke-color, var(--acv-color-form-secondary));
    --acv-radio-icon-ring-fill: var(--acv-radio-icon-fill-color, var(--acv-color-form-primary));
    --acv-radio-icon-selection-stroke: var(--acv-color-form-active);
    --acv-radio-icon-selection-fill: var(--acv-color-form-primary);
    --acv-radio-icon-size: var(--acv-font-size-accent);
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    position: relative;

    &.checked {
      --acv-radio-icon-ring-stroke: var(--acv-radio-icon-stroke-color, var(--acv-color-form-active));
    }

    &.disabled,
    &:disabled {
      --acv-radio-icon-ring-stroke: var(--acv-color-form-disabled-primary);
      --acv-radio-icon-ring-fill: var(--acv-color-form-disabled-secondary);
      --acv-radio-icon-selection-stroke: var(--acv-color-form-disabled-secondary);
      --acv-radio-icon-selection-fill: var(--acv-color-form-disabled-tertiary);
      cursor: default;
      pointer-events: none;
    }

    &.small {
      --acv-radio-icon-size: var(--acv-font-size-body);
    }

    &.large {
      --acv-radio-icon-size: var(--acv-font-size-lead);
    }

    &:not(&:disabled)&:active,
    &:not(&:disabled)&.active,
    &:not(&:disabled)&:hover,
    &:not(&:disabled)&.hover{
      --acv-radio-icon-ring-stroke: var(--acv-color-form-hover);
      --acv-radio-icon-ring-fill: var(--acv-color-form-primary);
      --acv-radio-icon-selection-stroke: var(--acv-color-form-hover);
      --acv-radio-icon-selection-fill: var(--acv-color-form-primary);
    }

    &:not(&:disabled)&:focus,
    &:not(&:disabled)&.focus,
    &:has(:focus)  {
      .acv-radio-icon {
        outline: var(--acv-color-form-focus) var(--acv-border-style-solid) var(--acv-border-x-large);
        border-radius: 8px;
      }
    }

    &.invalid {
      .acv-radio-icon {
        outline: var(--acv-color-form-error) var(--acv-border-style-solid) var(--acv-border-x-large);
        border-radius: 8px;
      }
    }

    .acv-radio-icon {
      min-width: 1em;
      font-size: var(--acv-radio-icon-size);

      .ring {
        stroke: var(--acv-radio-icon-ring-stroke);
        fill: var(--acv-radio-icon-ring-fill);
      }

      .selection {
        stroke: var(--acv-radio-icon-ring-stroke);
        fill: var(--acv-radio-icon-selection-fill);
      }
    }

    .hidden {
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
