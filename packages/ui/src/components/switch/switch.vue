<script setup lang="ts">
  import { computed, useAttrs } from 'vue';
  import type {
    AcvSwitchEvents,
    AcvSwitchProps,
    AcvSwitchSlots
  } from './switch.ts';
  import './switch.css';

  defineOptions({
    name: 'AcvSwitch',
    inheritAttrs: false
  });
  const props = defineProps<AcvSwitchProps>();

  defineEmits<AcvSwitchEvents>();
  const slots = defineSlots<AcvSwitchSlots>();
  const checked = defineModel();
  const attrs = useAttrs();
  const isChecked = computed(() => checked.value === attrs.value);

  const switchClasses = computed(() => ({
    'acv-switch': true,
    'checked': isChecked.value,
    'disabled': props.disabled,
    [props.size as string]: props.size,
    'inverted': props.color === 'inverted',
  }));

  const switchColor = computed(() => {
    return props.color && props.color !== 'inverted' ? `var(--acv-color-${props.color})` : '';
  });
</script>

<template>
  <label
    :class="[switchClasses, attrs.class]"
  >
    <span class="acv-switch__input">
      <input
        v-model="checked"
        :value="attrs.value"
        :checked="isChecked"
        :disabled="props.disabled"
        :aria-disabled="props.disabled"
        type="checkbox"
        role="switch"
        class="visually-hidden"
      >
      <span
        class="acv-switch__thumb"
        aria-hidden="true"
      />
    </span>
    <span
      v-if="slots.default || props.label"
      class="acv-switch__label"
    >
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<style scoped>
  .acv-switch {
    --acv-switch-custom-color: v-bind(switchColor);
    align-items:center;
    display: inline-flex;
    font-family: var(--acv-font-family-default), sans-serif;
    padding-block: 4px;
    cursor: pointer;

    .acv-switch__input {
      width: calc((var(--acv-switch-input-thumb-size) * 2) + (var(--acv-switch-input-gutter) * 3));
      height: calc(var(--acv-switch-input-thumb-size) + (var(--acv-switch-input-gutter) * 2));
      border-radius: calc(var(--acv-switch-input-thumb-size) + var(--acv-switch-input-gutter));
      padding: var(--acv-switch-input-gutter);
      background: var(--acv-switch-input-off-bg);
      color: var(--acv-switch-input-off-text);
      text-align: left;
      text-transform: uppercase;
      font-family: var(--acv-switch-input-font-family);
      font-weight: var(--acv-switch-input-font-weight);
      position: relative;
      cursor: pointer;
      container-type: inline-size;

      &:has(:focus-visible) .acv-switch__thumb {
        outline: var(--acv-switch-input-focus-stroke);
      }

      &:has(:checked) {
        background: var(--acv-switch-custom-color, var(--acv-switch-input-on-bg));
        color: var(--acv-switch-input-on-text);
      }

      &:has(:checked) .acv-switch__thumb {
        inset-inline-start: calc(
            var(--acv-switch-input-thumb-size) + (var(--acv-switch-input-gutter) * 2)
        );
      }

      .acv-switch__thumb {
        display: block;
        width: var(--acv-switch-input-thumb-size);
        height: var(--acv-switch-input-thumb-size);
        border-radius: var(--acv-switch-input-thumb-size);
        background: var(--acv-switch-input-thumb-bg);
        border: var(--acv-switch-input-thumb-stroke);
        z-index: var(--acv-z-index-normal);
        position: absolute;
        inset-block-start: var(--acv-switch-input-gutter);
        inset-inline-start: var(--acv-switch-input-gutter);
        transition: var(--acv-switch-input-transition);
      }
    }

    .acv-switch__label {
      color: var(--acv-switch-label-color);
      padding-inline: 8px;
    }

    &.small {
      --acv-switch-input-thumb-size: 10px;
    }

    &.large {
      --acv-switch-input-thumb-size: 18px;
    }

    &.inverted {
      --acv-switch-input-thumb-bg: var(--acv-color-primary);
      --acv-switch-input-off-bg: var(--acv-color-form-secondary);
      --acv-switch-input-off-text: var(--acv-color-text-primary);
      --acv-switch-input-on-bg: var(--acv-color-inverted);
      --acv-switch-input-on-text: var(--acv-color-text-primary);
      --acv-switch-label-color: var(--acv-color-text-disabled);
    }

    &.disabled {
      --acv-switch-input-off-bg: var(--acv-color-form-disabled-secondary);
      --acv-switch-input-off-text: var(--acv-color-white);
      --acv-switch-input-on-bg: var(--acv-color-form-disabled-success);
      --acv-switch-input-on-text: var(--acv-color-white);
      --acv-switch-label-color: var(--acv-color-text-disabled);
      pointer-events: none;
      cursor: default;
    }
  }
</style>
