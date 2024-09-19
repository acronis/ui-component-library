<script lang="ts" setup>
  import GoFormControl from '../GoForm/GoFormControl.vue';
  import GoCheckbox from '@/components/GoCheckbox/GoCheckbox.vue';
  import { useGoField } from '@/composables';
  import type { CheckboxModel } from '@/components/GoCheckbox/checkbox.ts';

  const props = defineProps<{
    name: string
    rules?: string
    label?: string
    disabled?: boolean
  }>();

  const { value, handleChange, handleBlur, errorMessage } = useGoField<CheckboxModel>(
    props.name,
    props.rules,
  );
</script>

<template>
  <GoFormControl :error-message="errorMessage">
    <GoCheckbox
      class="control"
      :name="name"
      :disabled="disabled"
      :model-value="value"
      v-bind="$attrs"
      @update:model-value="handleChange"
      @blur="handleBlur"
    >
      <template v-if="label">
        {{ label }}
      </template>
      <slot v-else />
    </GoCheckbox>
    <template
      v-if="$slots.informer"
      #informer
    >
      <slot name="informer" />
    </template>
  </GoFormControl>
</template>

<style scoped>
  .control {
    align-self: flex-start;
  }
</style>
