<script setup lang="ts">
  import type {
    AcvCheckboxEvents,
    AcvCheckboxProps,
    AcvCheckboxSlots
  } from './checkbox.ts';
  import { useCheckbox } from '@/composables/useCheckbox';
  import { computed, toRef, useAttrs } from 'vue';
  import CheckboxIcon from '../icon-internal/CheckboxIcon.vue';

  import './checkbox.css';

  defineOptions({
    name: 'AcvCheckbox',
    inheritAttrs: false,
  });

  const props = withDefaults(defineProps<AcvCheckboxProps>(), {
    color: 'primary',
    size: 'medium',
    uncheckedValue: false,
    indeterminateValue: null
  });
  const emit = defineEmits<AcvCheckboxEvents>();
  const slots = defineSlots<AcvCheckboxSlots>();
  const attrs = useAttrs();

  // const checked = defineModel();
  // const indeterminate = defineModel('indeterminate');
  const _checkedValue = computed<Exclude<AcvCheckboxProps['checkedValue'], undefined>>(
    () => props.checkedValue || attrs.value as Exclude<AcvCheckboxProps['checkedValue'], undefined> || true
  );

  const {
    isChecked,
    isIndeterminate,
    onChange
  } = useCheckbox(
    toRef(props, 'modelValue'),
    emit,
    _checkedValue,
    toRef(props, 'uncheckedValue'),
    toRef(props, 'indeterminateValue'),
    toRef(props, 'cycleIndeterminate')
  );

  const checkboxId = `acv-checkbox-${props.id ? props.id : attrs.value || Math.random().toString(36).slice(2, 7)}`;
  const checkboxClasses = computed(() => ({
    'acv-checkbox': true,
    [attrs.class as string]: attrs.class,
    'disabled': props.disabled
  }));
</script>

<template>
  <label
    :for="checkboxId"
    :class="checkboxClasses"
  >
    <input
      :id="checkboxId"
      :name="checkboxId"
      class="hidden"
      :checked="isChecked"
      :disabled="props.disabled"
      :aria-disabled="props.disabled"
      :aria-invalid="props.invalid"
      :aria-required="props.required"
      :indeterminate="isIndeterminate"
      type="checkbox"
      @change="onChange"
    >
    <slot
      name="icon"
      :checked="isChecked"
    >
      <CheckboxIcon
        class="icon"
        :class="props.iconClass"
        :checked="isChecked"
        :size="size"
        :indeterminate="isIndeterminate"
        :disabled="props.disabled"
        :invalid="props.invalid"
        :color="props.color"
      />
    </slot>
    <span
      v-if="slots.default || props.label"
      class="px-8"
    >
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<style scoped>
  .acv-checkbox {
    font-family: var(--acv-font-family-default), sans-serif;
    font-weight: var(--acv-font-weight-strong);
    color: var(--acv-checkbox-color);
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;

    &:has(:focus) .icon {
      --acv-checkbox-icon-focus: true;
      outline: var(--acv-color-form-focus) var(--acv-border-style-solid) var(--acv-border-large);
      border-radius: 4px;
    }

    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
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
